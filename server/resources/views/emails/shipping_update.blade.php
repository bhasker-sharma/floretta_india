<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Order Update — Floretta</title>
<style>
  body { margin: 0; padding: 0; background: #f5f0ea; font-family: Georgia, serif; }
  .wrap { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 4px; overflow: hidden; }
  .header { background: #3b2a1a; padding: 32px 40px; text-align: center; }
  .header h1 { color: #e8d5b7; font-size: 24px; margin: 0 0 4px; letter-spacing: 3px; font-weight: 400; }
  .header p { color: #c4a882; font-size: 13px; margin: 0; }
  .body { padding: 40px; color: #3b2a1a; }
  .body p { font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
  .status-box { background: #f5f0ea; border-radius: 4px; padding: 20px 24px; margin: 24px 0; text-align: center; }
  .status-box .label { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 8px; }
  .status-box .status { font-size: 22px; font-weight: 700; color: #3b2a1a; text-transform: capitalize; }
  .order-ref { font-size: 13px; color: #888; margin-top: 6px; }
  .footer { background: #f5f0ea; padding: 20px 40px; text-align: center; font-size: 12px; color: #999; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>FLORETTA</h1>
    <p>Order Update</p>
  </div>
  <div class="body">
    <p>Hi {{ $order->user->name ?? 'there' }},</p>
    <p>Your order status has been updated.</p>

    <div class="status-box">
      <div class="label">Current Status</div>
      <div class="status">{{ ucfirst(str_replace('_', ' ', $order->status)) }}</div>
      <div class="order-ref">Order {{ $order->order_number }}</div>
    </div>

    @if(!empty($note))
    <p>{{ $note }}</p>
    @endif

    @if($order->status === 'shipped')
    <p>Your order is on its way! You can expect delivery within 3–5 business days.</p>
    @elseif($order->status === 'delivered')
    <p>Your order has been delivered. We hope you love it!</p>
    @endif

    <p>If you have any questions, reply to this email or contact us at <a href="mailto:support@floretta.in" style="color:#3b2a1a">support@floretta.in</a>.</p>
  </div>
  <div class="footer">&copy; {{ date('Y') }} Floretta India. All rights reserved.</div>
</div>
</body>
</html>
