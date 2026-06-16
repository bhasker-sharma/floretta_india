<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Order Confirmed — Floretta</title>
<style>
  body { margin: 0; padding: 0; background: #f5f0ea; font-family: Georgia, serif; }
  .wrap { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 4px; overflow: hidden; }
  .header { background: #3b2a1a; padding: 32px 40px; text-align: center; }
  .header h1 { color: #e8d5b7; font-size: 24px; margin: 0 0 4px; letter-spacing: 3px; font-weight: 400; }
  .header p { color: #c4a882; font-size: 13px; margin: 0; }
  .body { padding: 40px; color: #3b2a1a; }
  .body p { font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
  .order-num { background: #f5f0ea; border-radius: 4px; padding: 16px 24px; margin: 20px 0; font-size: 14px; }
  .order-num strong { font-size: 18px; display: block; margin-top: 4px; letter-spacing: 1px; }
  table.items { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
  table.items th { text-align: left; border-bottom: 2px solid #e8d5b7; padding: 8px 4px; color: #888; font-weight: normal; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
  table.items td { padding: 12px 4px; border-bottom: 1px solid #f0ebe4; vertical-align: top; }
  .totals { margin: 20px 0; font-size: 14px; }
  .totals tr td { padding: 6px 4px; }
  .totals tr.total td { font-weight: 700; font-size: 16px; border-top: 2px solid #e8d5b7; padding-top: 12px; }
  .address-box { background: #f5f0ea; border-radius: 4px; padding: 20px 24px; margin: 20px 0; font-size: 14px; line-height: 1.7; }
  .footer { background: #f5f0ea; padding: 20px 40px; text-align: center; font-size: 12px; color: #999; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>FLORETTA</h1>
    <p>Order Confirmed</p>
  </div>
  <div class="body">
    <p>Hi {{ $order->user->name ?? 'there' }},</p>
    <p>Thank you for your order! We've received it and will begin preparing it shortly.</p>

    <div class="order-num">
      Order Number
      <strong>{{ $order->order_number }}</strong>
    </div>

    <table class="items">
      <thead>
        <tr>
          <th>Product</th>
          <th>Variant</th>
          <th style="text-align:center">Qty</th>
          <th style="text-align:right">Price</th>
        </tr>
      </thead>
      <tbody>
        @foreach($order->items as $item)
        <tr>
          <td>{{ $item['product_name'] }}</td>
          <td>{{ $item['variant_label'] }}</td>
          <td style="text-align:center">{{ $item['qty'] }}</td>
          <td style="text-align:right">₹{{ number_format($item['subtotal']) }}</td>
        </tr>
        @endforeach
      </tbody>
    </table>

    <table class="totals">
      <tr>
        <td>Subtotal</td>
        <td style="text-align:right">₹{{ number_format($order->subtotal) }}</td>
      </tr>
      <tr>
        <td>Shipping</td>
        <td style="text-align:right">{{ $order->shipping_charge == 0 ? 'Free' : '₹' . number_format($order->shipping_charge) }}</td>
      </tr>
      <tr class="total">
        <td>Total</td>
        <td style="text-align:right">₹{{ number_format($order->total) }}</td>
      </tr>
    </table>

    <p><strong>Shipping Address</strong></p>
    <div class="address-box">
      {{ $order->shipping_address['name'] ?? '' }}<br>
      {{ $order->shipping_address['line1'] ?? '' }}@if(!empty($order->shipping_address['line2'])), {{ $order->shipping_address['line2'] }}@endif<br>
      {{ $order->shipping_address['city'] ?? '' }}, {{ $order->shipping_address['state'] ?? '' }} — {{ $order->shipping_address['pincode'] ?? '' }}<br>
      Phone: {{ $order->shipping_address['phone'] ?? '' }}
    </div>

    <p>We'll send you another email when your order ships.</p>
  </div>
  <div class="footer">&copy; {{ date('Y') }} Floretta India. All rights reserved.</div>
</div>
</body>
</html>
