<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Services\OrderService;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orders,
        private PaymentService $payments
    ) {}

    public function initiate(Request $r)
    {
        $v = Validator::make($r->all(), [
            'address.name'   => 'required|string',
            'address.phone'  => 'required|string',
            'address.line1'  => 'required|string',
            'address.city'   => 'required|string',
            'address.state'  => 'required|string',
            'address.pincode'=> 'required|string',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $cartItems = Cart::where('user_id', auth()->id())
            ->with(['product', 'variant'])->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty.'], 422);
        }

        $subtotal = $cartItems->sum(fn($i) => $i->qty * $i->price_at_add);
        $shipping = $this->orders->calculateShipping($subtotal);
        $total    = $subtotal + $shipping;

        $rzpOrder = $this->payments->createOrder($total * 100, 'INR', 'order_'.time());

        return response()->json([
            'razorpay_order_id' => $rzpOrder->id,
            'amount'            => $total * 100,
            'currency'          => 'INR',
            'subtotal'          => $subtotal,
            'shipping'          => $shipping,
            'total'             => $total,
        ]);
    }

    public function verifyPayment(Request $r)
    {
        $v = Validator::make($r->all(), [
            'razorpay_order_id'   => 'required',
            'razorpay_payment_id' => 'required',
            'razorpay_signature'  => 'required',
            'address'             => 'required|array',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        if (!$this->payments->verifySignature($r->razorpay_order_id, $r->razorpay_payment_id, $r->razorpay_signature)) {
            return response()->json(['message' => 'Payment verification failed.'], 422);
        }

        $cartItems = Cart::where('user_id', auth()->id())->with(['product','variant'])->get();
        $order = $this->orders->createOrder(auth()->user(), $cartItems->toArray(), $r->address, [
            'payment_status'      => 'paid',
            'payment_method'      => 'razorpay',
            'razorpay_order_id'   => $r->razorpay_order_id,
            'razorpay_payment_id' => $r->razorpay_payment_id,
            'razorpay_signature'  => $r->razorpay_signature,
        ]);

        return response()->json(['order_number' => $order->order_number, 'order' => $order], 201);
    }

    public function cod(Request $r)
    {
        $v = Validator::make($r->all(), ['address' => 'required|array']);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $cartItems = Cart::where('user_id', auth()->id())->with(['product','variant'])->get();
        $subtotal  = $cartItems->sum(fn($i) => $i->qty * $i->price_at_add);

        if ($subtotal + $this->orders->calculateShipping($subtotal) > 3000) {
            return response()->json(['message' => 'COD not available for orders above ₹3,000.'], 422);
        }

        $order = $this->orders->createOrder(auth()->user(), $cartItems->toArray(), $r->address, [
            'payment_status' => 'pending',
            'payment_method' => 'cod',
        ]);

        return response()->json(['order_number' => $order->order_number, 'order' => $order], 201);
    }

    public function index()
    {
        $orders = Order::where('user_id', auth()->id())
            ->orderByDesc('created_at')
            ->paginate(10);
        return response()->json($orders);
    }

    public function show($number)
    {
        $order = Order::where('order_number', $number)
            ->where('user_id', auth()->id())
            ->with('statusUpdates')
            ->firstOrFail();
        return response()->json($order);
    }
}