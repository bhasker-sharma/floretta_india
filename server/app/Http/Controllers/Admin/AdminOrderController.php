<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\MailService;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function __construct(private MailService $mail) {}

    // Dashboard expects: order_number, customer_name, customer_email, customer_phone,
    // customer_address, order_items[{name,quantity,price}], order_quantity,
    // order_value, order_status, is_verified, created_at
    private function fmt(Order $o): array
    {
        $addr    = is_array($o->shipping_address) ? $o->shipping_address : [];
        $addrStr = implode(', ', array_filter([
            $addr['line1']   ?? '',
            $addr['line2']   ?? '',
            $addr['city']    ?? '',
            $addr['state']   ?? '',
            $addr['pincode'] ?? '',
        ]));

        $items = collect($o->items ?? [])->map(fn($i) => [
            'name'         => $i['product_name'] ?? '',
            'product_name' => $i['product_name'] ?? '',
            'quantity'     => $i['qty']          ?? 1,
            'price'        => round(($i['unit_price'] ?? 0) / 100, 2),
            'variant_label'=> $i['variant_label'] ?? '',
        ])->values()->toArray();

        $statusLabel = [
            'confirmed'  => 'Order Placed',
            'processing' => 'Order Placed',
            'shipped'    => 'Shipped',
            'delivered'  => 'Delivered',
            'cancelled'  => 'Cancelled',
            'refunded'   => 'Refunded',
        ][$o->status] ?? 'Order Placed';

        return [
            'id'               => $o->id,
            'order_number'     => $o->order_number,
            'customer_name'    => $o->user?->name  ?? ($addr['name']  ?? 'Guest'),
            'customer_email'   => $o->user?->email ?? '',
            'customer_phone'   => $o->user?->phone ?? ($addr['phone'] ?? ''),
            'customer_address' => $addrStr,
            'order_items'      => $items,
            'order_quantity'   => collect($o->items ?? [])->sum('qty'),
            'order_value'      => round($o->total / 100, 2),
            'order_status'     => $statusLabel,
            'status'           => $o->status,
            'payment_status'   => $o->payment_status,
            'payment_method'   => $o->payment_method,
            'razorpay_payment_id' => $o->razorpay_payment_id,
            'is_verified'      => in_array($o->status, ['shipped', 'delivered']),
            'shipping_address' => $o->shipping_address,
            'subtotal'         => round($o->subtotal / 100, 2),
            'shipping_charge'  => round($o->shipping_charge / 100, 2),
            'total'            => round($o->total / 100, 2),
            'created_at'       => $o->created_at,
            'updated_at'       => $o->updated_at,
        ];
    }

    public function index(Request $r)
    {
        $q = Order::with('user')->orderByDesc('created_at');
        if ($r->status) $q->where('status', $r->status);
        if ($r->from)   $q->whereDate('created_at', '>=', $r->from);
        if ($r->to)     $q->whereDate('created_at', '<=', $r->to);

        $paginated = $q->paginate(50);

        return response()->json([
            'orders'       => collect($paginated->items())->map(fn($o) => $this->fmt($o))->values(),
            'total'        => $paginated->total(),
            'current_page' => $paginated->currentPage(),
            'last_page'    => $paginated->lastPage(),
        ]);
    }

    public function newOrders()
    {
        $orders = Order::with('user')
            ->whereIn('status', ['confirmed', 'processing'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($o) => $this->fmt($o));

        return response()->json(['orders' => $orders]);
    }

    public function verify($id)
    {
        $order = Order::findOrFail($id);
        if ($order->status === 'confirmed') {
            $order->update(['status' => 'processing']);
        }
        return response()->json(['order' => $this->fmt($order->fresh())]);
    }

    public function show($id)
    {
        $order = Order::with(['user', 'statusUpdates'])->findOrFail($id);
        return response()->json($this->fmt($order) + ['status_updates' => $order->statusUpdates]);
    }

    public function updateStatus(Request $r, $id)
    {
        $order   = Order::with('user')->findOrFail($id);
        $adminId = auth('admin')->id();

        // Accept dashboard label ("Shipped") or internal slug ("shipped")
        $labelToSlug = [
            'Order Placed' => 'confirmed',
            'Shipped'      => 'shipped',
            'In-Transit'   => 'shipped',
            'Delivered'    => 'delivered',
            'Cancelled'    => 'cancelled',
        ];
        $newStatus = $labelToSlug[$r->status] ?? $r->status;

        $order->update(['status' => $newStatus]);
        $order->statusUpdates()->create([
            'status'              => $newStatus,
            'note'                => $r->note,
            'tracking_number'     => $r->tracking_number,
            'updated_by_admin_id' => $adminId,
        ]);

        if ($newStatus === 'shipped') {
            try { $this->mail->sendShippingUpdate($order, $r->tracking_number, $r->note); } catch (\Exception $e) {}
        }

        return response()->json(['order' => $this->fmt($order->fresh())]);
    }
}
