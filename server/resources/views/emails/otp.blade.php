<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Verify Your Email — Floretta</title>
<style>
  body { margin: 0; padding: 0; background: #f5f0ea; font-family: Georgia, serif; }
  .wrap { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 4px; overflow: hidden; }
  .header { background: #3b2a1a; padding: 32px 40px; text-align: center; }
  .header h1 { color: #e8d5b7; font-size: 24px; margin: 0; letter-spacing: 3px; font-weight: 400; }
  .body { padding: 40px; color: #3b2a1a; }
  .body p { font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
  .otp-box { background: #f5f0ea; border-radius: 4px; padding: 24px; text-align: center; margin: 28px 0; }
  .otp-box span { font-size: 40px; letter-spacing: 10px; font-weight: 700; color: #3b2a1a; font-family: monospace; }
  .note { font-size: 13px; color: #888; }
  .footer { background: #f5f0ea; padding: 20px 40px; text-align: center; font-size: 12px; color: #999; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><h1>FLORETTA</h1></div>
  <div class="body">
    <p>Hi {{ $user->name }},</p>
    <p>Use the code below to verify your email address. This code expires in <strong>10 minutes</strong>.</p>
    <div class="otp-box"><span>{{ $otp }}</span></div>
    <p class="note">If you did not create an account with Floretta, you can safely ignore this email.</p>
  </div>
  <div class="footer">&copy; {{ date('Y') }} Floretta India. All rights reserved.</div>
</div>
</body>
</html>
