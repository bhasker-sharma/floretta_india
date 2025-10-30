<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Invoice - Floretta India</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .email-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #c06 0%, #a05 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 32px;
            margin-bottom: 5px;
        }
        .header p {
            font-size: 14px;
            opacity: 0.9;
        }
        .invoice-info {
            display: flex;
            justify-content: space-between;
            padding: 30px;
            background-color: #f9f9f9;
            border-bottom: 2px solid #c06;
        }
        .invoice-info div {
            flex: 1;
        }
        .invoice-info h3 {
            color: #c06;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .invoice-info p {
            margin: 5px 0;
            font-size: 14px;
        }
        .order-details {
            padding: 30px;
        }
        .order-details h2 {
            color: #232946;
            margin-bottom: 20px;
            font-size: 20px;
            border-bottom: 2px solid #c06;
            padding-bottom: 10px;
        }
        .order-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .order-table th {
            background-color: #232946;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 13px;
            font-weight: 600;
        }
        .order-table td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
            font-size: 13px;
        }
        .order-table tr:hover {
            background-color: #f9f9f9;
        }
        .text-right {
            text-align: right;
        }
        .total-section {
            margin-top: 30px;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            text-align: right;
        }
        .total-row {
            display: flex;
            justify-content: flex-end;
            margin: 10px 0;
            font-size: 16px;
        }
        .total-label {
            margin-right: 20px;
            font-weight: 600;
            min-width: 150px;
            text-align: right;
        }
        .total-value {
            min-width: 120px;
            text-align: right;
        }
        .grand-total {
            font-size: 20px;
            color: #c06;
            font-weight: bold;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #c06;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status-paid {
            background-color: #d4edda;
            color: #155724;
        }
        .status-pending {
            background-color: #fff3cd;
            color: #856404;
        }
        .footer {
            background-color: #232946;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .footer p {
            margin: 5px 0;
            font-size: 13px;
        }
        .footer .contact-info {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255,255,255,0.2);
        }
        .thank-you {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px 20px;
            margin: 20px 0;
            font-size: 14px;
        }
        @media only screen and (max-width: 600px) {
            .invoice-info {
                flex-direction: column;
            }
            .invoice-info div {
                margin-bottom: 20px;
            }
            .order-table {
                font-size: 11px;
            }
            .order-table th,
            .order-table td {
                padding: 8px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>Floretta India</h1>
            <p>Premium Fragrances & Perfumes</p>
            <p style="font-size: 12px; margin-top: 10px;"><strong>GST No:</strong> 05ANWPK8158L1Z4</p>
        </div>

        <!-- Invoice Info -->
        <div class="invoice-info">
            <div>
                <h3>Invoice To:</h3>
                <p><strong>{{ $order->customer_name }}</strong></p>
                <p>{{ $order->customer_email }}</p>
                <p>{{ $order->customer_phone }}</p>
                <p>{{ $order->customer_address }}</p>
                @if($order->include_gst && $user && $user->gst_number)
                    <p><strong>GST Number:</strong> {{ $user->gst_number }}</p>
                @endif
            </div>
            <div style="text-align: right;">
                <h3>Order Details:</h3>
                <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
                <p><strong>Order Date:</strong> {{ $order->created_at->format('d M, Y') }}</p>
                <p><strong>Payment ID:</strong> {{ $order->razorpay_payment_id }}</p>
                <p><strong>Status:</strong>
                    <span class="status-badge status-{{ strtolower($order->status) }}">
                        {{ $order->status }}
                    </span>
                </p>
            </div>
        </div>

        <!-- Order Details -->
        <div class="order-details">
            <h2>Order Summary</h2>

            <div class="thank-you">
                <strong>Thank you for your order!</strong> Your order has been confirmed and will be processed shortly.
            </div>

            <table class="order-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Product Name</th>
                        <th class="text-right">Quantity</th>
                        <th class="text-right">Price</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @php $sno = 1; @endphp
                    @foreach($order->order_items as $item)
                    <tr>
                        <td>{{ $sno++ }}</td>
                        <td>{{ $item['name'] ?? 'Product' }}</td>
                        <td class="text-right">{{ $item['quantity'] ?? 0 }}</td>
                        <td class="text-right">₹{{ number_format($item['price'] ?? 0, 2) }}</td>
                        <td class="text-right">₹{{ number_format(($item['quantity'] ?? 0) * ($item['price'] ?? 0), 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <!-- Total Section -->
            <div class="total-section">
                <div class="total-row">
                    <div class="total-label">Total Quantity:</div>
                    <div class="total-value">{{ $order->order_quantity }} items</div>
                </div>
                <div class="total-row grand-total">
                    <div class="total-label">Grand Total:</div>
                    <div class="total-value">₹{{ number_format($order->order_value, 2) }}</div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Floretta India</strong></p>
            <p>Your Trusted Fragrance Partner</p>
            <div class="contact-info">
                <p><strong>Address:</strong> Sarswati Puram Colony, Near Dikhshalya Institute</p>
                <p>Khankhal, Haridwar, Uttarakhand - 249408</p>
                <p style="margin-top: 10px;">Phone: +91 9639970148 | Email: florettaindia@gmail.com</p>
                <p>Website: www.florettaindia.com</p>
                <p>© {{ date('Y') }} Floretta India. All rights reserved.</p>
            </div>
            <p style="margin-top: 15px; font-size: 11px; opacity: 0.8;">
                This is an automated email. Please do not reply to this message.
            </p>
        </div>
    </div>
</body>
</html>
