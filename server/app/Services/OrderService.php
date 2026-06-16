<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Str;

class OrderService
{
    public function __construct(private MailService $mailService) {}

    public function calculateShipping(int $subtotal): int
    {
        return $subtotal >= 999 ? 0 : 79;
    }

    public function buildItemsSnapshot(array $cartItems): array
    {
        return collect($cartItems)->map(fn($item) => [
            'product_id'   => $item->product_id,
            'product_name' => $item->product->name ?? '',
            'variant_id'   => $item->variant_id,
            'variant_label'=> $item->variant->label ?? '',
            'qty'          => $item->qty,
            'unit_price'   => $item->price_at_add,
            'subtotal'     => $item->qty * $item->price_at_add,
        ])->toArray();
    }

    public function createOrder(User $user, array $cartItems, array $address, array $paymentData = []): Order
    {
        $items    = $this->buildItemsSnapshot($cartItems);
        $subtotal = collect($items)->sum('subtotal');
        $shipping = $this->calculateShipping($subtotal);
        $total    = $subtotal + $shipping;

        $order = Order::create([
            'order_number'        => $this->generateOrderNumber(),
            'user_id'             => $user->id,
            'status'              => 'confirmed',
            'payment_status'      => $paymentData['payment_status'] ?? 'paid',
            'payment_method'      => $paymentData['payment_method'] ?? 'razorpay',
            'razorpay_order_id'   => $paymentData['razorpay_order_id'] ?? null,
            'razorpay_payment_id' => $paymentData['razorpay_payment_id'] ?? null,
            'razorpay_signature'  => $paymentData['razorpay_signature'] ?? null,
            'subtotal'            => $subtotal,
            'shipping_charge'     => $shipping,
            'total'               => $total,
            'shipping_address'    => $address,
            'items'               => $items,
        ]);

        $order->statusUpdates()->create([
            'status' => 'confirmed',
            'note'   => 'Order placed successfully.',
        ]);

        Cart::where('user_id', $user->id)->delete();

        $this->mailService->sendOrderConfirmation($order);

        return $order;
    }

    private function generateOrderNumber(): string
    {
        do {
            $number = 'FL-' . strtoupper(Str::random(8));
        } while (Order::where('order_number', $number)->exists());

        return $number;
    }
}
