<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #c06;
            margin: 0;
        }
        .otp-box {
            background-color: #fff;
            border: 2px dashed #c06;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #c06;
            letter-spacing: 8px;
            margin: 10px 0;
        }
        .message {
            text-align: center;
            margin: 20px 0;
            color: #666;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #999;
            font-size: 12px;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Floretta India</h1>
            <p>Password Reset Request</p>
        </div>

        <p>Hello,</p>
        <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>

        <div class="otp-box">
            <p style="margin: 0; color: #666;">Your OTP Code</p>
            <div class="otp-code">{{ $otp }}</div>
            <p style="margin: 0; color: #666; font-size: 12px;">Valid for 10 minutes</p>
        </div>

        <div class="warning">
            <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
        </div>

        <div class="message">
            <p>This OTP will expire in 10 minutes for security reasons.</p>
            <p>Please do not share this code with anyone.</p>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} Floretta India. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
