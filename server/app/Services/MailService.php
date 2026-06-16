<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Order;

class MailService
{
    public function sendOtpEmail(User $user, string $otp): void
    {
        Mail::send('emails.otp', ['user' => $user, 'otp' => $otp], function ($message) use ($user) {
            $message->to($user->email, $user->name)
                    ->subject('Your Floretta verification code');
        });
    }

    public function sendPasswordResetOtp(string $email, string $otp): void
    {
        Mail::send('emails.password_reset', ['otp' => $otp, 'toEmail' => $email], function ($message) use ($email) {
            $message->to($email)
                    ->subject('Reset your Floretta password');
        });
    }

    public function sendOrderConfirmation(Order $order): void
    {
        $user = $order->user;
        if (!$user?->email) return;
        Mail::send('emails.order_confirmation', ['order' => $order], function ($message) use ($user, $order) {
            $message->to($user->email, $user->name)
                    ->subject("Order confirmed — {$order->order_number}");
        });
    }

    public function sendShippingUpdate(Order $order, string $trackingNumber = null, string $note = null): void
    {
        $user = $order->user;
        if (!$user?->email) return;
        Mail::send('emails.shipping_update', [
            'order'          => $order,
            'trackingNumber' => $trackingNumber,
            'note'           => $note,
        ], function ($message) use ($user, $order) {
            $message->to($user->email, $user->name)
                    ->subject("Your Floretta order is on its way — {$order->order_number}");
        });
    }
}
