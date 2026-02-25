# Supabase メールテンプレート

Supabase Dashboard → **Authentication** → **Email Templates** に貼り付けてください。

---

## 1. Confirm signup（アカウント登録確認）

**件名:** QuantMarket - アカウント登録の確認

```html
<div style="max-width:520px;margin:0 auto;font-family:'Helvetica Neue',Arial,'Hiragino Sans',sans-serif;color:#1a1a1a;line-height:1.7">
  <div style="text-align:center;padding:32px 0 24px">
    <h1 style="font-size:22px;font-weight:700;letter-spacing:-0.5px;margin:0">
      <span style="color:#1a1a1a">Quant</span><span style="color:#6b7280">Market</span>
    </h1>
  </div>

  <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:32px">
    <h2 style="font-size:18px;font-weight:600;margin:0 0 16px">アカウント登録ありがとうございます</h2>

    <p style="margin:0 0 16px;color:#374151">
      QuantMarketへのご登録ありがとうございます。<br>
      以下のボタンをクリックして、メールアドレスの確認を完了してください。
    </p>

    <div style="text-align:center;margin:24px 0">
      <a href="{{ .ConfirmationURL }}"
         style="display:inline-block;background:#111827;color:#ffffff;font-size:14px;font-weight:600;padding:12px 32px;border-radius:9999px;text-decoration:none">
        メールアドレスを確認する
      </a>
    </div>

    <p style="margin:0;font-size:13px;color:#9ca3af">
      このメールに心当たりがない場合は、無視していただいて問題ありません。
    </p>
  </div>

  <div style="text-align:center;padding:24px 0;font-size:12px;color:#9ca3af">
    &copy; QuantMarket（クオンツマーケット）
  </div>
</div>
```

---

## 2. Magic Link（マジックリンクログイン）

**件名:** QuantMarket - ログインリンク

```html
<div style="max-width:520px;margin:0 auto;font-family:'Helvetica Neue',Arial,'Hiragino Sans',sans-serif;color:#1a1a1a;line-height:1.7">
  <div style="text-align:center;padding:32px 0 24px">
    <h1 style="font-size:22px;font-weight:700;letter-spacing:-0.5px;margin:0">
      <span style="color:#1a1a1a">Quant</span><span style="color:#6b7280">Market</span>
    </h1>
  </div>

  <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:32px">
    <h2 style="font-size:18px;font-weight:600;margin:0 0 16px">ログインリンク</h2>

    <p style="margin:0 0 16px;color:#374151">
      以下のボタンをクリックしてQuantMarketにログインしてください。
    </p>

    <div style="text-align:center;margin:24px 0">
      <a href="{{ .ConfirmationURL }}"
         style="display:inline-block;background:#111827;color:#ffffff;font-size:14px;font-weight:600;padding:12px 32px;border-radius:9999px;text-decoration:none">
        ログインする
      </a>
    </div>

    <p style="margin:0;font-size:13px;color:#9ca3af">
      このリンクは一度のみ有効です。心当たりがない場合は無視してください。
    </p>
  </div>

  <div style="text-align:center;padding:24px 0;font-size:12px;color:#9ca3af">
    &copy; QuantMarket（クオンツマーケット）
  </div>
</div>
```

---

## 3. Change Email Address（メールアドレス変更）

**件名:** QuantMarket - メールアドレス変更の確認

```html
<div style="max-width:520px;margin:0 auto;font-family:'Helvetica Neue',Arial,'Hiragino Sans',sans-serif;color:#1a1a1a;line-height:1.7">
  <div style="text-align:center;padding:32px 0 24px">
    <h1 style="font-size:22px;font-weight:700;letter-spacing:-0.5px;margin:0">
      <span style="color:#1a1a1a">Quant</span><span style="color:#6b7280">Market</span>
    </h1>
  </div>

  <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:32px">
    <h2 style="font-size:18px;font-weight:600;margin:0 0 16px">メールアドレス変更の確認</h2>

    <p style="margin:0 0 16px;color:#374151">
      メールアドレスの変更リクエストを受け付けました。<br>
      以下のボタンをクリックして、新しいメールアドレスを確認してください。
    </p>

    <div style="text-align:center;margin:24px 0">
      <a href="{{ .ConfirmationURL }}"
         style="display:inline-block;background:#111827;color:#ffffff;font-size:14px;font-weight:600;padding:12px 32px;border-radius:9999px;text-decoration:none">
        メールアドレスを確認する
      </a>
    </div>

    <p style="margin:0;font-size:13px;color:#9ca3af">
      この変更に心当たりがない場合は、アカウントのセキュリティをご確認ください。
    </p>
  </div>

  <div style="text-align:center;padding:24px 0;font-size:12px;color:#9ca3af">
    &copy; QuantMarket（クオンツマーケット）
  </div>
</div>
```

---

## 4. Reset Password（パスワードリセット）

**件名:** QuantMarket - パスワードリセット

```html
<div style="max-width:520px;margin:0 auto;font-family:'Helvetica Neue',Arial,'Hiragino Sans',sans-serif;color:#1a1a1a;line-height:1.7">
  <div style="text-align:center;padding:32px 0 24px">
    <h1 style="font-size:22px;font-weight:700;letter-spacing:-0.5px;margin:0">
      <span style="color:#1a1a1a">Quant</span><span style="color:#6b7280">Market</span>
    </h1>
  </div>

  <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:32px">
    <h2 style="font-size:18px;font-weight:600;margin:0 0 16px">パスワードリセット</h2>

    <p style="margin:0 0 16px;color:#374151">
      パスワードリセットのリクエストを受け付けました。<br>
      以下のボタンをクリックして、新しいパスワードを設定してください。
    </p>

    <div style="text-align:center;margin:24px 0">
      <a href="{{ .ConfirmationURL }}"
         style="display:inline-block;background:#111827;color:#ffffff;font-size:14px;font-weight:600;padding:12px 32px;border-radius:9999px;text-decoration:none">
        パスワードをリセットする
      </a>
    </div>

    <p style="margin:0;font-size:13px;color:#9ca3af">
      このリクエストに心当たりがない場合は、無視していただいて問題ありません。<br>
      ボタンをクリックしない限り、パスワードは変更されません。
    </p>
  </div>

  <div style="text-align:center;padding:24px 0;font-size:12px;color:#9ca3af">
    &copy; QuantMarket（クオンツマーケット）
  </div>
</div>
```
