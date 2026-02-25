import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaymentItem {
  productId: string;
  name: string;
  price: number;
}

interface PaymentRequest {
  items: PaymentItem[];
  customerName: string;
  customerEmail: string;
  authUserId?: string | null;
}

/**
 * Square API ベースURL
 * SQUARE_ENVIRONMENT=sandbox → Sandbox API
 * それ以外（production/未設定） → 本番API
 */
function getSquareBaseUrl(): string {
  const env = Deno.env.get("SQUARE_ENVIRONMENT") ?? "production";
  return env === "sandbox"
    ? "https://connect.squareupsandbox.com/v2"
    : "https://connect.squareup.com/v2";
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get("SQUARE_ACCESS_TOKEN");
    const locationId = Deno.env.get("SQUARE_LOCATION_ID");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!accessToken || !locationId) {
      throw new Error("Square credentials not configured");
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not configured");
    }

    const squareBaseUrl = getSquareBaseUrl();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const {
      items,
      customerName,
      customerEmail,
      authUserId,
    }: PaymentRequest = await req.json();

    // Validate inputs
    if (!items || items.length === 0 || !customerName || !customerEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate unique order ID
    const orderId = `QM-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
    const productIds = items.map((i) => i.productId).join(",");
    const productNames = items.map((i) => i.name).join(", ");

    // Customer upsert（service_role で実行）
    let customerId: string | null = null;
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id, auth_user_id")
      .eq("email", customerEmail)
      .maybeSingle();

    if (existingCustomer) {
      customerId = existingCustomer.id;
      if (authUserId && !existingCustomer.auth_user_id) {
        await supabase
          .from("customers")
          .update({ auth_user_id: authUserId })
          .eq("id", existingCustomer.id);
      }
    } else {
      const { data: newCustomer } = await supabase
        .from("customers")
        .insert({
          email: customerEmail,
          name: customerName,
          ...(authUserId ? { auth_user_id: authUserId } : {}),
        })
        .select("id")
        .single();
      if (newCustomer) {
        customerId = newCustomer.id;
      }
    }

    // Save order to database (payment_status: pending)
    const { error: dbError } = await supabase.from("orders").insert({
      order_id: orderId,
      product_id: productIds,
      product_name: productNames,
      price: totalPrice,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_id: customerId,
      payment_method: "card",
      payment_status: "pending",
    });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save order");
    }

    // Create order_items — resolve product UUIDs from slugs
    for (const item of items) {
      const { data: product } = await supabase
        .from("products")
        .select("id, seller_id, commission_rate")
        .eq("slug", item.productId)
        .maybeSingle();

      if (product) {
        const feeRate = product.commission_rate ?? 0.20;
        const platformFee = Math.round(item.price * feeRate);
        const sellerAmount = item.price - platformFee;

        await supabase.from("order_items").insert({
          order_id: orderId,
          product_id: product.id,
          product_slug: item.productId,
          product_name: item.name,
          price: item.price,
          seller_id: product.seller_id ?? null,
          platform_fee: platformFee,
          seller_amount: sellerAmount,
        });
      }
    }

    // Build line_items for Square order
    const lineItems = items.map((item) => ({
      name: item.name,
      quantity: "1",
      base_price_money: {
        amount: Math.round(item.price),
        currency: "JPY",
      },
    }));

    // Create Square Checkout Link
    const isSandbox = (Deno.env.get("SQUARE_ENVIRONMENT") ?? "production") === "sandbox";

    const checkoutBody: Record<string, unknown> = {
      idempotency_key: orderId,
      order: {
        location_id: locationId,
        reference_id: orderId,
        line_items: lineItems,
      },
      checkout_options: {
        redirect_url: `${req.headers.get("origin") || "https://quant-market-hub.lovable.app"}/purchase/complete?product=${encodeURIComponent(productNames)}&method=card&order=${encodeURIComponent(orderId)}`,
      },
    };

    // Sandbox ではメールのバリデーションが厳しいため、本番のみ pre_populated_data を送信
    if (!isSandbox && customerEmail) {
      checkoutBody.pre_populated_data = { buyer_email: customerEmail };
    }

    const squareResponse = await fetch(
      `${squareBaseUrl}/online-checkout/payment-links`,
      {
        method: "POST",
        headers: {
          "Square-Version": "2024-01-18",
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutBody),
      }
    );

    if (!squareResponse.ok) {
      const errorData = await squareResponse.json();
      console.error("Square API error:", JSON.stringify(errorData));

      await supabase
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("order_id", orderId);

      throw new Error(`Square API error: ${squareResponse.status}`);
    }

    const squareData = await squareResponse.json();
    const squareOrderId = squareData.payment_link?.order_id ?? null;

    // Save Square order ID for webhook matching
    if (squareOrderId) {
      await supabase
        .from("orders")
        .update({ square_order_id: squareOrderId })
        .eq("order_id", orderId);
    }

    console.log("Square payment link created:", {
      orderId,
      squareOrderId,
      productIds,
      customerEmail,
      environment: Deno.env.get("SQUARE_ENVIRONMENT") ?? "production",
      url: squareData.payment_link?.url,
    });

    return new Response(
      JSON.stringify({
        success: true,
        checkoutUrl: squareData.payment_link?.url,
        orderId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in create-square-payment:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
