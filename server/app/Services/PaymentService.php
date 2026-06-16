<?php

namespace App\Services;

use Razorpay\Api\Api;

class PaymentService
{
    private Api $api;

    public function __construct()
    {
        $this->api = new Api(
            config('services.razorpay.key'),
            config('services.razorpay.secret')
        );
    }

    public function createOrder(int $amountPaise, string $currency = 'INR', string $receipt = ''): object
    {
        return $this->api->order->create([
            'amount'   => $amountPaise,
            'currency' => $currency,
            'receipt'  => $receipt,
            'payment_capture' => 1,
        ]);
    }

    public function verifySignature(string $razorpayOrderId, string $razorpayPaymentId, string $razorpaySignature): bool
    {
        try {
            $this->api->utility->verifyPaymentSignature([
                'razorpay_order_id'   => $razorpayOrderId,
                'razorpay_payment_id' => $razorpayPaymentId,
                'razorpay_signature'  => $razorpaySignature,
            ]);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
