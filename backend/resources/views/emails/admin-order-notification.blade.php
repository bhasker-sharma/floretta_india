<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Notification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 700px; margin: 30px auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #f37254;">
            <h1 style="color: #f37254; margin: 0; font-size: 28px;">Floretta India</h1>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Admin Order Notification</p>
        </div>

        <div style="padding: 30px 0;">
            <div style="background-color: #fff5f2; border-left: 4px solid #f37254; padding: 15px; margin-bottom: 20px;">
                <h2 style="color: #333; margin: 0 0 10px 0; font-size: 22px;">🛍️ New Order Received!</h2>
                <p style="color: #666; margin: 0; font-size: 14px;">A new order has been placed on your website.</p>
            </div>

            <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #f37254; margin: 0 0 15px 0; font-size: 18px;">Order Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px; width: 40%;"><strong>Order ID:</strong></td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px;">{{ $order->razorpay_order_id }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Payment ID:</strong></td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px;">{{ $order->razorpay_payment_id }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Order Date:</strong></td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px;">{{ $order->created_at->format('d M Y, h:i A') }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Order Value:</strong></td>
                        <td style="padding: 8px 0; color: #28a745; font-size: 16px; font-weight: bold;">₹{{ number_format($order->order_value, 2) }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Total Items:</strong></td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px;">{{ $order->order_quantity }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Payment Status:</strong></td>
                        <td style="padding: 8px 0;">
                            <span style="background-color: #28a745; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">PAID</span>
                        </td>
                    </tr>
                </table>
            </div>

            <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #f37254; margin: 0 0 15px 0; font-size: 18px;">Customer Information</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px; width: 40%;"><strong>Name:</strong></td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px;">{{ $order->customer_name }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Email:</strong></td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px;">{{ $order->customer_email }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Phone:</strong></td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px;">{{ $order->customer_phone }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px; vertical-align: top;"><strong>Address:</strong></td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px;">{{ $order->customer_address }}</td>
                    </tr>
                    @if($order->include_gst && $gstNumber)
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>GST Number:</strong></td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px;">{{ $gstNumber }}</td>
                    </tr>
                    @endif
                </table>
            </div>

            <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #f37254; margin: 0 0 15px 0; font-size: 18px;">Order Items</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f37254; color: white;">
                            <th style="padding: 10px; text-align: left; font-size: 14px;">Product</th>
                            <th style="padding: 10px; text-align: center; font-size: 14px;">Qty</th>
                            <th style="padding: 10px; text-align: right; font-size: 14px;">Price</th>
                            <th style="padding: 10px; text-align: right; font-size: 14px;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($orderItems as $item)
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 12px 10px; color: #333; font-size: 14px;">{{ $item['name'] }}</td>
                            <td style="padding: 12px 10px; color: #333; font-size: 14px; text-align: center;">{{ $item['quantity'] }}</td>
                            <td style="padding: 12px 10px; color: #333; font-size: 14px; text-align: right;">₹{{ number_format($item['price'], 2) }}</td>
                            <td style="padding: 12px 10px; color: #333; font-size: 14px; text-align: right; font-weight: bold;">₹{{ number_format($item['price'] * $item['quantity'], 2) }}</td>
                        </tr>
                        @endforeach
                        <tr>
                            <td colspan="3" style="padding: 15px 10px; color: #333; font-size: 16px; text-align: right; font-weight: bold;">Total Amount:</td>
                            <td style="padding: 15px 10px; color: #28a745; font-size: 18px; text-align: right; font-weight: bold;">₹{{ number_format($order->order_value, 2) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="background-color: #fff5f2; border-radius: 8px; padding: 15px; text-align: center;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                    ℹ️ Please process this order and update the customer about the shipping details.
                </p>
            </div>
        </div>

        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 14px;">
            <p><strong>Floretta India</strong></p>
            <p>Your Trusted Fragrance Partner</p>
            <p style="margin-top: 10px;">Sarswati Puram Colony, Near Dikhshalya Institute<br>Khankhal, Haridwar, Uttarakhand - 249408</p>
            <p>Phone: +91 9639970148 | Email: florettaindia@gmail.com</p>
            <p style="margin-top: 15px; font-size: 12px;">This is an automated notification from your e-commerce system.</p>
        </div>
    </div>
</body>
</html>
