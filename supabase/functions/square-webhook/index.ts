import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

/**
 * Square Webhook Handler
 *
 * Square からの決済完了通知を受け取り、注文ステータスを更新する。
 * イベント: payment.completed, payment.updated
 *
 * Supabase Secrets に必要な値:
 *   SQUARE_WEBHOOK_SIGNATURE_KEY — Square Developer Dashboard の Webhooks で取得
 *   SQUARE_ACCESS_TOKEN           — Square API トークン
 *   SQUARE_ENVIRONMENT            — "sandbox" or "production"
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

function getSquareBaseUrl(): string {
  const env = Deno.env.get("SQUARE_ENVIRONMENT") ?? "production";
  return env === "sandbox"
    ? "https://connect.squareupsandbox.com/v2"
    : "https://connect.squareup.com/v2";
}

/**
 * Square Webhook 署名検証
 * HMAC-SHA256(webhookSignatureKey, notificationUrl + body) を base64 と比較
 */
async function verifySignature(
  body: string,
  signatureHeader: string,
  signatureKey: string,
  notificationUrl: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(signatureKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const payload = notificationUrl + body;
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload),
  );

  const expectedBase64 = btoa(
    String.fromCharCode(...new Uint8Array(signature)),
  );

  return expectedBase64 === signatureHeader;
}

serve(async (req: Request): Promise<Response> => {
  // Webhook は POST のみ
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const signatureKey = Deno.env.get("SQUARE_WEBHOOK_SIGNATURE_KEY");
  const accessToken = Deno.env.get("SQUARE_ACCESS_TOKEN");

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials");
    return new Response("Server configuration error", { status: 500 });
  }

  const rawBody = await req.text();

  // 署名検証（キーが設定されている場合）
  if (signatureKey) {
    const signature = req.headers.get("x-square-hmacsha256-signature") ?? "";
    // Edge Function 内部の req.url は外部URLと異なる場合があるため、
    // 環境変数 or Supabase URL から正規のWebhook URLを構築
    const notificationUrl =
      Deno.env.get("SQUARE_WEBHOOK_URL") ||
      `${supabaseUrl}/functions/v1/square-webhook`;

    const isValid = await verifySignature(
      rawBody,
      signature,
      signatureKey,
      notificationUrl,
    );

    if (!isValid) {
      console.error("Webhook signature verification failed");
      return new Response("Invalid signature", { status: 403 });
    }
  }

  const event = JSON.parse(rawBody);
  const eventType: string = event.type ?? "";

  console.log("Square webhook received:", {
    type: eventType,
    eventId: event.event_id,
  });

  // payment.completed または payment.updated を処理
  if (
    eventType !== "payment.completed" &&
    eventType !== "payment.updated"
  ) {
    // 他のイベントは無視して 200 を返す（Square に再送させない）
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payment = event.data?.object?.payment;
  if (!payment) {
    console.error("No payment object in webhook event");
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const squarePaymentId: string = payment.id ?? "";
  const squareOrderId: string = payment.order_id ?? "";
  const paymentStatus: string = payment.status ?? "";

  console.log("Payment details:", {
    squarePaymentId,
    squareOrderId,
    paymentStatus,
  });

  // COMPLETED でない場合はステータス更新しない
  if (paymentStatus !== "COMPLETED") {
    console.log(`Payment status is ${paymentStatus}, skipping update`);
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // 方法1: square_order_id で直接マッチ
  let matchedOrderId: string | null = null;

  const { data: orderBySquareId } = await supabase
    .from("orders")
    .select("order_id")
    .eq("square_order_id", squareOrderId)
    .maybeSingle();

  if (orderBySquareId) {
    matchedOrderId = orderBySquareId.order_id;
  } else if (accessToken && squareOrderId) {
    // 方法2: Square Orders API で reference_id（= 内部order_id）を取得
    try {
      const squareBaseUrl = getSquareBaseUrl();
      const orderResponse = await fetch(
        `${squareBaseUrl}/orders/${squareOrderId}`,
        {
          headers: {
            "Square-Version": "2024-01-18",
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        const referenceId = orderData.order?.reference_id;
        if (referenceId) {
          matchedOrderId = referenceId;
        }
      }
    } catch (err) {
      console.error("Failed to fetch Square order:", err);
    }
  }

  if (!matchedOrderId) {
    console.error(
      `Could not match Square order ${squareOrderId} to internal order`,
    );
    return new Response(JSON.stringify({ received: true, matched: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 注文ステータスを completed に更新
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      payment_status: "completed",
      square_payment_id: squarePaymentId,
      square_order_id: squareOrderId,
    })
    .eq("order_id", matchedOrderId);

  if (updateError) {
    console.error("Failed to update order:", updateError);
    return new Response(JSON.stringify({ error: "Database update failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log(
    `Order ${matchedOrderId} updated to completed (Square payment: ${squarePaymentId})`,
  );

  return new Response(
    JSON.stringify({ received: true, orderId: matchedOrderId, status: "completed" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
});
