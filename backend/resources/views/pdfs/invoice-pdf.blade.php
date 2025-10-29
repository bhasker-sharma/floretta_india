<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice - {{ $order->order_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 11px;
            color: #000;
            line-height: 1.4;
            padding: 20px;
        }
        .header {
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 2px solid #000;
            display: table;
            width: 100%;
        }
        .header-left {
            display: table-cell;
            vertical-align: middle;
            width: 70px;
        }
        .header-left img {
            width: 60px;
            height: auto;
        }
        .header-center {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
        }
        .header-center h1 {
            font-size: 22px;
            margin-bottom: 3px;
        }
        .header-center p {
            font-size: 10px;
            margin: 3px 0;
        }
        .invoice-info {
            margin-bottom: 18px;
        }
        .invoice-info table {
            width: 100%;
            border-collapse: collapse;
        }
        .invoice-info td {
            padding: 8px;
            vertical-align: top;
            width: 50%;
            font-size: 10px;
        }
        .invoice-info h3 {
            font-size: 12px;
            margin-bottom: 6px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .invoice-info p {
            margin: 3px 0;
            line-height: 1.5;
        }
        .order-table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
        }
        .order-table th {
            background-color: #000;
            color: #fff;
            padding: 8px 6px;
            text-align: left;
            font-size: 10px;
            font-weight: bold;
            border: 1px solid #000;
        }
        .order-table td {
            padding: 7px 6px;
            border: 1px solid #000;
            font-size: 10px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-section {
            margin-top: 12px;
            width: 100%;
        }
        .total-section table {
            width: 100%;
            border-collapse: collapse;
        }
        .total-section td {
            padding: 6px 10px;
            font-size: 10px;
        }
        .total-section td:first-child {
            text-align: right;
            font-weight: bold;
            width: 75%;
        }
        .total-section td:last-child {
            text-align: right;
            width: 25%;
            border: 1px solid #000;
        }
        .grand-total td {
            font-size: 12px;
            font-weight: bold;
            padding: 8px 10px;
            border: 2px solid #000 !important;
        }
        .footer {
            margin-top: 18px;
            padding-top: 12px;
            border-top: 1px solid #000;
            text-align: center;
            font-size: 9px;
            line-height: 1.5;
        }
        .footer p {
            margin: 3px 0;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-left">
            <img src="{{ public_path('images/logo.png') }}" alt="Floretta Logo">
        </div>
        <div class="header-center">
            <h1>FLORETTA INDIA</h1>
            <p>Premium Fragrances & Perfumes</p>
            <p><strong>GST No:</strong> 05ANWPK8158L1Z4</p>
            <p style="font-size: 10px; margin-top: 5px;"><strong>INVOICE</strong></p>
        </div>
    </div>

    <!-- Invoice Info -->
    <div class="invoice-info">
        <table>
            <tr>
                <td>
                    <h3>Bill To:</h3>
                    <p><strong>{{ $order->customer_name }}</strong></p>
                    <p>{{ $order->customer_email }}</p>
                    <p>{{ $order->customer_phone }}</p>
                    <p>{{ $order->customer_address }}</p>
                    @if($order->include_gst && $user && $user->gst_number)
                        <p><strong>GST:</strong> {{ $user->gst_number }}</p>
                    @endif
                </td>
                <td style="text-align: right;">
                    <h3>Invoice Details:</h3>
                    <p><strong>Invoice No:</strong> {{ $order->order_number }}</p>
                    <p><strong>Date:</strong> {{ $order->created_at->format('d M, Y') }}</p>
                    <p><strong>Payment ID:</strong> {{ $order->razorpay_payment_id }}</p>
                    <p><strong>Status:</strong> {{ $order->status }}</p>
                </td>
            </tr>
        </table>
    </div>

    <!-- Order Table -->
    <table class="order-table">
        <thead>
            <tr>
                <th style="width: 6%;">S.No</th>
                <th style="width: 48%;">Product Name</th>
                <th style="width: 12%;" class="text-center">Qty</th>
                <th style="width: 17%;" class="text-right">Price</th>
                <th style="width: 17%;" class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @php $sno = 1; @endphp
            @foreach($order->order_items as $item)
            <tr>
                <td class="text-center">{{ $sno++ }}</td>
                <td>{{ $item['name'] ?? 'Product' }}</td>
                <td class="text-center">{{ $item['quantity'] ?? 0 }}</td>
                <td class="text-right">₹{{ number_format($item['price'] ?? 0, 2) }}</td>
                <td class="text-right">₹{{ number_format(($item['quantity'] ?? 0) * ($item['price'] ?? 0), 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Total Section -->
    <div class="total-section">
        <table>
            <tr>
                <td>Total Items:</td>
                <td>{{ $order->order_quantity }}</td>
            </tr>
            <tr class="grand-total">
                <td>GRAND TOTAL:</td>
                <td>₹{{ number_format($order->order_value, 2) }}</td>
            </tr>
        </table>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p><strong>Floretta India</strong> - Your Trusted Fragrance Partner</p>
        <p>Sarswati Puram Colony, Near Dikhshalya Institute, Khankhal, Haridwar, Uttarakhand - 249408</p>
        <p>Phone: +91 9639970148 | Email: florettaindia@gmail.com | Website: www.florettaindia.com</p>
        <p style="margin-top: 5px;">© {{ date('Y') }} Floretta India. All rights reserved.</p>
        <p style="margin-top: 3px;">This is a computer-generated invoice and does not require a signature.</p>
    </div>
</body>
</html>
