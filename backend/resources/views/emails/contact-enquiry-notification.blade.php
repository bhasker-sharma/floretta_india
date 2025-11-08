<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Hotel Amenities Enquiry</title>
    <style>
        body { font-family: Arial, sans-serif; color: #222; }
        .container { max-width: 640px; margin: 0 auto; padding: 16px; }
        h1 { font-size: 20px; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 8px 6px; vertical-align: top; }
        .label { color: #666; width: 200px; }
        .value { color: #111; }
        .footer { margin-top: 20px; color: #777; font-size: 12px; }
    </style>
</head>
<body>
<div class="container">
    <h1>New Hotel Amenities Enquiry</h1>
    <p>You have received a new enquiry from the Hotel Amenities contact form. Details are below:</p>

    <table>
        <tr>
            <td class="label">Hotel Name</td>
            <td class="value">{{ $contact->hotel_name }}</td>
        </tr>
        <tr>
            <td class="label">Email</td>
            <td class="value">{{ $contact->email }}</td>
        </tr>
        <tr>
            <td class="label">Mobile</td>
            <td class="value">{{ $contact->mobile }}</td>
        </tr>
        <tr>
            <td class="label">Packaging Option</td>
            <td class="value">{{ $contact->packaging_option }}</td>
        </tr>
        <tr>
            <td class="label">Preferred Fragrance</td>
            <td class="value">{{ $contact->preferred_fragrance }}</td>
        </tr>
        <tr>
            <td class="label">Estimated Quantity</td>
            <td class="value">{{ $contact->estimated_quantity }}</td>
        </tr>
        <tr>
            <td class="label">Additional Requirements</td>
            <td class="value">{{ $contact->additional_requirements ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Submitted At</td>
            <td class="value">{{ optional($contact->created_at)->format('d M Y, h:i A') }}</td>
        </tr>
    </table>

    <p class="footer">This is an automated notification from Floretta India.</p>
</div>
</body>
</html>
