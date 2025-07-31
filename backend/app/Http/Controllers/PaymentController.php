<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Razorpay\Api\Api;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function createOrder(Request $request)
    {
        $api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));

        $receipt = 'rcpt_' . uniqid();
        $order = $api->order->create([
            'receipt'         => $receipt,
            'amount'          => $request->amount * 100, // INR to paise
            'currency'        => 'INR',
            'payment_capture' => 1
        ]);

        return response()->json([
            'order_id' => $order['id'],
            'key' => env('RAZORPAY_KEY'),
            'amount' => $order['amount'],
            'currency' => $order['currency']
        ]);
    }

    public function verifyPayment(Request $request)
    {
        $data = $request->only('razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature');

        $generatedSignature = hash_hmac('sha256', $data['razorpay_order_id'] . "|" . $data['razorpay_payment_id'], env('RAZORPAY_SECRET'));

        if ($generatedSignature === $data['razorpay_signature']) {
            return response()->json(['status' => 'success', 'message' => 'Payment verified']);
        } else {
            return response()->json(['status' => 'error', 'message' => 'Signature mismatch'], 400);
        }
    }
}
