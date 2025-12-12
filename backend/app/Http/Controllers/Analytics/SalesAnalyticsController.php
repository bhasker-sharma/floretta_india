<?php

/**
 * Sales Analytics Controller
 *
 * Provides detailed sales performance metrics including:
 * - Sales KPIs (revenue, orders, conversion rate, refunds)
 * - Daily sales trends (revenue and order count)
 * - Sales breakdown by product category
 * - Sales distribution by payment method
 * - Order status breakdown
 */

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\productpage\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SalesAnalyticsController extends Controller
{
    /**
     * Get sales analytics data
     *
     * Returns comprehensive sales metrics including KPIs with trends,
     * daily sales breakdown, category performance, and payment method distribution.
     *
     * @param Request $request - Contains start_date and end_date parameters
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Parse date range from request, default to last 30 days
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->startOfDay());
        $endDate = $request->input('end_date', Carbon::now()->endOfDay());

        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        // Calculate previous period for trend comparison
        $daysDiff = $start->diffInDays($end);
        $prevStart = $start->copy()->subDays($daysDiff + 1);
        $prevEnd = $start->copy()->subDay();

        // ===== CURRENT PERIOD METRICS =====

        // Paid orders (successful sales)
        $currentOrders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->get();

        $totalRevenue = $currentOrders->sum('order_value');
        $totalOrders = $currentOrders->count();

        // Conversion rate: (paid orders / all orders) * 100
        $allOrders = Order::whereBetween('created_at', [$start, $end])->count();
        $conversionRate = $allOrders > 0 ? ($totalOrders / $allOrders) * 100 : 0;

        // Refunded orders count
        $refundedOrders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'refunded')
            ->count();

        // ===== PREVIOUS PERIOD METRICS (for trend calculation) =====

        $prevOrders = Order::whereBetween('created_at', [$prevStart, $prevEnd])
            ->where('status', 'paid')
            ->get();

        $prevRevenue = $prevOrders->sum('order_value');
        $prevOrderCount = $prevOrders->count();

        $prevAllOrders = Order::whereBetween('created_at', [$prevStart, $prevEnd])->count();
        $prevConversionRate = $prevAllOrders > 0 ? ($prevOrderCount / $prevAllOrders) * 100 : 0;

        $prevRefunded = Order::whereBetween('created_at', [$prevStart, $prevEnd])
            ->where('status', 'refunded')
            ->count();

        // ===== CALCULATE TRENDS (percentage change) =====

        $revenueTrend = $prevRevenue > 0 ? (($totalRevenue - $prevRevenue) / $prevRevenue) * 100 : 0;
        $ordersTrend = $prevOrderCount > 0 ? (($totalOrders - $prevOrderCount) / $prevOrderCount) * 100 : 0;
        $conversionTrend = $prevConversionRate > 0 ? (($conversionRate - $prevConversionRate) / $prevConversionRate) * 100 : 0;
        $refundedTrend = $prevRefunded > 0 ? (($refundedOrders - $prevRefunded) / $prevRefunded) * 100 : 0;

        // ===== SALES BY DAY (daily revenue and order trends) =====

        $salesByDay = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(order_value) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // ===== SALES BY CATEGORY =====
        // Parse JSON order_items and aggregate by product category

        $salesByCategory = $this->getSalesByCategory($start, $end);

        // ===== SALES BY PAYMENT METHOD =====
        // Note: Database doesn't have payment_method column, using Razorpay as default

        $salesByPaymentMethod = collect([
            [
                'payment_method' => 'Razorpay',
                'orders' => $totalOrders,
                'revenue' => $totalRevenue
            ]
        ]);

        // ===== SALES BY ORDER STATUS =====

        $salesByStatus = Order::select(
                'order_status',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(order_value) as revenue')
            )
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('order_status')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'kpis' => [
                    'total_revenue' => [
                        'value' => round($totalRevenue, 2),
                        'trend' => round($revenueTrend, 2),
                        'label' => 'Total Revenue'
                    ],
                    'total_orders' => [
                        'value' => $totalOrders,
                        'trend' => round($ordersTrend, 2),
                        'label' => 'Total Orders'
                    ],
                    'conversion_rate' => [
                        'value' => round($conversionRate, 2),
                        'trend' => round($conversionTrend, 2),
                        'label' => 'Conversion Rate'
                    ],
                    'refunded_orders' => [
                        'value' => $refundedOrders,
                        'trend' => round($refundedTrend, 2),
                        'label' => 'Refunded Orders'
                    ],
                ],
                'sales_by_day' => $salesByDay,
                'sales_by_category' => $salesByCategory,
                'sales_by_payment_method' => $salesByPaymentMethod,
                'sales_by_status' => $salesByStatus,
            ]
        ]);
    }

    /**
     * Get sales by category from JSON order_items
     *
     * Aggregates sales data by product category (using scent field as category).
     * Returns revenue, units sold, and order count per category.
     *
     * @param Carbon $start - Start date
     * @param Carbon $end - End date
     * @return \Illuminate\Support\Collection
     */
    private function getSalesByCategory($start, $end)
    {
        // Get all paid orders with order_items
        $orders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->select('id', 'order_items')
            ->get();

        // Extract all product IDs from orders
        $productIds = [];
        foreach ($orders as $order) {
            $items = $order->order_items ?? [];
            foreach ($items as $item) {
                if (isset($item['product_id'])) {
                    $productIds[] = $item['product_id'];
                }
            }
        }

        // Get product details (scent used as category since no category column exists)
        $products = Product::whereIn('id', array_unique($productIds))
            ->select('id', 'scent', 'brand')
            ->get()
            ->keyBy('id');

        // Aggregate sales by category
        $categoryStats = [];

        foreach ($orders as $order) {
            $items = $order->order_items ?? [];

            foreach ($items as $item) {
                $productId = $item['product_id'] ?? null;
                if (!$productId) continue;

                $product = $products->get($productId);
                // Use scent as category, brand as fallback, 'Uncategorized' as default
                $category = $product ? ($product->scent ?? $product->brand ?? 'Uncategorized') : 'Uncategorized';

                $quantity = $item['quantity'] ?? 0;
                $price = $item['price'] ?? 0;
                $revenue = $quantity * $price;

                // Initialize category stats if not exists
                if (!isset($categoryStats[$category])) {
                    $categoryStats[$category] = [
                        'category' => $category,
                        'revenue' => 0,
                        'units_sold' => 0,
                        'orders' => 0,
                    ];
                }

                $categoryStats[$category]['revenue'] += $revenue;
                $categoryStats[$category]['units_sold'] += $quantity;
            }
        }

        // Count unique orders per category
        foreach ($orders as $order) {
            $items = $order->order_items ?? [];
            $categoriesInOrder = [];

            foreach ($items as $item) {
                $productId = $item['product_id'] ?? null;
                if (!$productId) continue;

                $product = $products->get($productId);
                $category = $product ? ($product->scent ?? $product->brand ?? 'Uncategorized') : 'Uncategorized';
                $categoriesInOrder[$category] = true;
            }

            // Increment order count for each unique category in this order
            foreach (array_keys($categoriesInOrder) as $category) {
                if (isset($categoryStats[$category])) {
                    $categoryStats[$category]['orders']++;
                }
            }
        }

        // Sort by revenue (descending)
        usort($categoryStats, function($a, $b) {
            return $b['revenue'] <=> $a['revenue'];
        });

        return collect($categoryStats);
    }
}
