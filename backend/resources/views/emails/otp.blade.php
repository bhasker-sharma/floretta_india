<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #f37254;">
            <h1 style="color: #f37254; margin: 0; font-size: 28px;">Floretta India</h1>
        </div>
        <div style="padding: 30px 0; text-align: center;">
            <h2 style="color: #333; margin-bottom: 10px;">Hello {{ $name }}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Thank you for registering with Floretta India. To complete your registration, please verify your email address using the OTP below:</p>
            <div style="background-color: #f9f9f9; border: 2px dashed #f37254; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; color: #666; font-size: 14px;">Your verification code is:</p>
                <div style="font-size: 36px; font-weight: bold; color: #f37254; letter-spacing: 8px; margin: 10px 0;">{{ $otp }}</div>
            </div>
            <div style="background-color: #fff5f2; border-left: 4px solid #f37254; padding: 15px; margin: 20px 0; font-size: 14px; color: #666;">
                <strong>⚠️ Important:</strong>
                <ul style="margin: 10px 0; padding-left: 20px; text-align: left;">
                    <li>This OTP will expire in <strong>10 minutes</strong></li>
                    <li>Do not share this code with anyone</li>
                    <li>If you did not request this code, please ignore this email</li>
                </ul>
            </div>
            <p style="color: #666; font-size: 16px;">Enter this code on the registration page to verify your email and complete your account setup.</p>
        </div>
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 14px;">
            <p><strong>Floretta India</strong></p>
            <p>Your Trusted Fragrance Partner</p>
            <p style="margin-top: 10px;">Sarswati Puram Colony, Near Dikhshalya Institute<br>Khankhal, Haridwar, Uttarakhand - 249408</p>
            <p>Phone: +91 9639970148 | Email: florettaindia@gmail.com</p>
            <p style="margin-top: 15px; font-size: 12px;">This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>
