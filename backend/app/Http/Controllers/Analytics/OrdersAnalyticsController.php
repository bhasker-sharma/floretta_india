<?php

/**
 * Orders Analytics Controller
 *
 * Handles detailed order listing with advanced filtering:
 * - Paginated orders list
 * - Search by order number, customer name, email
 * - Filter by payment status and fulfillment status
 * - Sort by various columns (date, amount, ID)
 * - Date range filtering
 */

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Carbon\Carbon;

class OrdersAnalyticsController extends Controller
{
    /**
     * Get orders with filters and pagination
     *
     * Returns paginated list of orders with comprehensive filtering options.
     * Used for detailed orders table in analytics dashboards.
     *
     * @param Request $request - Contains filters, search, sort, and pagination params
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Parse parameters
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->startOfDay());
        $endDate = $request->input('end_date', Carbon::now()->endOfDay());
        $search = $request->input('search', '');
        $paymentStatus = $request->input('payment_status', '');
        $fulfillmentStatus = $request->input('fulfillment_status', '');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $perPage = $request->input('per_page', 15);

        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        // ===== BUILD QUERY WITH FILTERS =====

        $query = Order::with('user')
            ->whereBetween('created_at', [$start, $end]);

        // Search filter: order ID, order number, customer name, customer email
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('order_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%")
                  ->orWhereHas('user', function($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Payment status filter (paid, pending, failed, refunded)
        if ($paymentStatus) {
            $query->where('status', $paymentStatus);
        }

        // Fulfillment status filter (Order Placed, Shipped, In-Transit, Delivered, etc.)
        if ($fulfillmentStatus) {
            $query->where('order_status', $fulfillmentStatus);
        }

        // Apply sorting
        $orders = $query->orderBy($sortBy, $sortOrder)->paginate($perPage);

        // Transform orders for frontend
        $orders->getCollection()->transform(function ($order) {
            $items = $order->order_items ?? [];

            // Extract item names for display
            $itemNames = array_map(function($item) {
                return $item['name'] ?? 'Unknown Product';
            }, $items);

            return [
                'id' => $order->id,
                'order_number' => $order->order_number ?? 'ORD-' . $order->id,
                'date' => $order->created_at->format('Y-m-d H:i:s'),
                'customer' => $order->customer_name ?? ($order->user->name ?? 'Guest'),
                'customer_email' => $order->customer_email ?? ($order->user->email ?? 'N/A'),
                'items' => implode(', ', $itemNames),
                'items_count' => count($items),
                'total' => $order->order_value,
                'payment_status' => $order->status,
                'fulfillment_status' => $order->order_status,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }
}
