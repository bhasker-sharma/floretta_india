<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Live Perfume Bar Booking</title>
    <style>
        body { font-family: Arial, sans-serif; color: #222; }
        .container { max-width: 640px; margin: 0 auto; padding: 16px; }
        h1 { font-size: 20px; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 8px 6px; vertical-align: top; }
        .label { color: #666; width: 160px; }
        .value { color: #111; }
        .footer { margin-top: 20px; color: #777; font-size: 12px; }
    </style>
</head>
<body>
<div class="container">
    <h1>New Live Perfume Bar Booking</h1>
    <p>You have received a new booking enquiry from the website. Details are below:</p>

    <table>
        <tr>
            <td class="label">Name</td>
            <td class="value">{{ $booking->name }}</td>
        </tr>
        <tr>
            <td class="label">Email</td>
            <td class="value">{{ $booking->email }}</td>
        </tr>
        <tr>
            <td class="label">Mobile</td>
            <td class="value">{{ $booking->mobile }}</td>
        </tr>
        <tr>
            <td class="label">Selected Package</td>
            <td class="value">{{ $booking->package }}</td>
        </tr>
        <tr>
            <td class="label">Message</td>
            <td class="value">{{ $booking->message ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Submitted At</td>
            <td class="value">{{ optional($booking->created_at)->format('d M Y, h:i A') }}</td>
        </tr>
    </table>

    <p class="footer">This is an automated notification from Floretta India.</p>
</div>
</body>
</html>
