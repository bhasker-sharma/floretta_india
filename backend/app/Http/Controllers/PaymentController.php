<?php

namespace App\Http\Controllers;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Mail\AdminOrderNotification;


class PaymentController extends Controller
{
    public function createOrder(Request $request)
    {
        $api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));

        $receipt = 'rcpt_' . uniqid();
        $order = $api->order->create([
            'receipt' => $receipt,
            'amount' => $request->amount * 100, // INR to paise
            'currency' => 'INR',
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
        $data = $request->validate([
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'required|string',
            'user_id' => 'required|integer|exists:users,id',
            'customer_name' => 'nullable|string',
            'customer_email' => 'nullable|email',
            'customer_phone' => 'nullable|string',
            'customer_address' => 'nullable|string',
            'order_value' => 'nullable|numeric',
            'order_quantity' => 'nullable|integer',
            'order_items' => 'nullable|array',
            'include_gst' => 'nullable|boolean',
        ]);
        $generatedSignature = hash_hmac(
            'sha256',
            $data['razorpay_order_id'].'|'.$data['razorpay_payment_id'],
            env('RAZORPAY_SECRET')
        );

        if (!hash_equals($generatedSignature, $data['razorpay_signature'])) {
            return response()->json(['status' => 'error', 'message' => 'Signature mismatch'], 400);
        }
            
            try{
                $today = Carbon::now()->format('Ymd');
                $countToday = Order::whereDate('created_at', Carbon::today())->count() + 1;
                $orderNumber = 'ORD' . $today . str_pad($countToday, 5, '0', STR_PAD_LEFT);
             // Save order to DB
            $order = Order::create([
                'user_id' => $data['user_id'],
                'order_number' => $orderNumber,
                'razorpay_order_id' => $data['razorpay_order_id'],
                'razorpay_payment_id' => $data['razorpay_payment_id'],
                'status' => 'Paid',
                'customer_name' => $data['customer_name'] ?? null,
                'customer_email' => $data['customer_email'] ?? null,
                'customer_phone' => $data['customer_phone'] ?? null,
                'customer_address' => $data['customer_address'] ?? null,
                'order_value' => $data['order_value'] ?? null,
                'order_quantity' => $data['order_quantity'] ?? null,
                'order_items' => $data['order_items'] ?? null,
                'include_gst' => $data['include_gst'] ?? false,
            ]);

            // Generate PDF invoice once for both customer and admin
            $user = User::find($data['user_id']);
            $customerEmail = $data['customer_email'] ?? $user->email;

            // Generate PDF invoice
            $pdf = Pdf::loadView('pdfs.invoice-pdf', [
                'order' => $order,
                'user' => $user
            ]);

            // Set PDF options
            $pdf->setPaper('a4', 'portrait');
            $pdf->setOption('isHtml5ParserEnabled', true);
            $pdf->setOption('isRemoteEnabled', true);

            // Generate filename
            $pdfFilename = 'Invoice_' . $orderNumber . '.pdf';
            $pdfContent = $pdf->output();

            // Send invoice email with PDF attachment to customer
            try {
                if ($customerEmail) {
                    // Send email with PDF attachment
                    Mail::send('emails.invoice', [
                        'order' => $order,
                        'user' => $user
                    ], function ($message) use ($customerEmail, $orderNumber, $pdfContent, $pdfFilename) {
                        $message->to($customerEmail)
                            ->subject('Order Confirmation & Invoice - ' . $orderNumber . ' - Floretta India')
                            ->attachData($pdfContent, $pdfFilename, [
                                'mime' => 'application/pdf',
                            ]);
                    });

                    Log::info('Invoice email with PDF sent successfully', [
                        'order_number' => $orderNumber,
                        'email' => $customerEmail,
                        'pdf_filename' => $pdfFilename
                    ]);
                }
            } catch (\Exception $e) {
                // Log email error but don't fail the order
                Log::error('Failed to send invoice email', [
                    'order_number' => $orderNumber,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }

            // Send order notification to admin with PDF attachment
            try {
                $adminEmail = env('ADMIN_NOTIFICATION_EMAIL');

                if ($adminEmail) {
                    // Get user's GST number if GST is included
                    $gstNumber = null;
                    if ($order->include_gst) {
                        $gstNumber = $user->gst_number;
                    }

                    // Send admin notification email with PDF attachment
                    Mail::to($adminEmail)->send(
                        new AdminOrderNotification($order, $data['order_items'] ?? [], $gstNumber, $pdfContent, $pdfFilename)
                    );

                    Log::info('Admin notification email sent successfully', [
                        'order_number' => $orderNumber,
                        'admin_email' => $adminEmail
                    ]);
                }
            } catch (\Exception $e) {
                // Log email error but don't fail the order
                Log::error('Failed to send admin notification email', [
                    'order_number' => $orderNumber,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Payment verified',
                'order_id' => $order->id,
                'order_number' => $orderNumber
            ]);
        } catch (\Throwable $e) {
            Log::error('Order insert failed', ['error' => $e->getMessage()]);
            return response()->json(['status' => 'error', 'message' => 'Failed to save order'], 500);
        }
    }
    public function myOrders()
    {
        $userId = auth('api')->id();
        $orders = Order::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        // Enrich order items with product images
        $orders->each(function ($order) {
            if ($order->order_items && is_array($order->order_items)) {
                $enrichedItems = [];
                foreach ($order->order_items as $item) {
                    if (isset($item['id'])) {
                        $product = \App\Models\productpage\Product::find($item['id']);
                        if ($product) {
                            // Use the image field (not image_path)
                            $item['image'] = $product->image ?? null;
                        }
                    }
                    $enrichedItems[] = $item;
                }
                $order->order_items = $enrichedItems;
            }
        });

        return response()->json($orders);
    }
}