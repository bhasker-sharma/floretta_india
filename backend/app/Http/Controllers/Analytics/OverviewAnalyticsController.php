<?php

/**
 * Overview Analytics Controller
 *
 * Handles high-level business analytics including:
 * - Revenue and order metrics with trend analysis
 * - Customer acquisition and retention stats
 * - Daily revenue and order trends
 * - Top performing products
 * - Average rating across all reviews
 */

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\ProductReview;
use App\Models\productpage\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class OverviewAnalyticsController extends Controller
{
    /**
     * Get overview analytics data
     *
     * Returns comprehensive business overview including KPIs, trends,
     * revenue charts, customer segmentation, and top products.
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

        // Get all paid orders in the current period
        $currentOrders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->get();

        $totalRevenue = $currentOrders->sum('order_value');
        $totalOrders = $currentOrders->count();
        $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        // Customer metrics: new vs returning
        $newCustomers = User::whereBetween('created_at', [$start, $end])->count();

        // Returning customers: those who ordered in this period but registered before it
        $returningCustomers = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->whereHas('user', function($q) use ($start) {
                $q->where('created_at', '<', $start);
            })
            ->distinct('user_id')
            ->count('user_id');

        $totalCustomers = $newCustomers + $returningCustomers;
        $returningCustomerPercent = $totalCustomers > 0 ? ($returningCustomers / $totalCustomers) * 100 : 0;

        // Average product rating
        $avgRating = ProductReview::whereBetween('created_at', [$start, $end])
            ->avg('rating') ?? 0;

        // ===== PREVIOUS PERIOD METRICS (for trend calculation) =====

        $prevOrders = Order::whereBetween('created_at', [$prevStart, $prevEnd])
            ->where('status', 'paid')
            ->get();

        $prevRevenue = $prevOrders->sum('order_value');
        $prevOrderCount = $prevOrders->count();
        $prevAvgOrderValue = $prevOrderCount > 0 ? $prevRevenue / $prevOrderCount : 0;
        $prevNewCustomers = User::whereBetween('created_at', [$prevStart, $prevEnd])->count();

        $prevAvgRating = ProductReview::whereBetween('created_at', [$prevStart, $prevEnd])
            ->avg('rating') ?? 0;

        // ===== CALCULATE TRENDS (percentage change from previous period) =====

        $revenueTrend = $prevRevenue > 0 ? (($totalRevenue - $prevRevenue) / $prevRevenue) * 100 : 0;
        $ordersTrend = $prevOrderCount > 0 ? (($totalOrders - $prevOrderCount) / $prevOrderCount) * 100 : 0;
        $avgOrderValueTrend = $prevAvgOrderValue > 0 ? (($avgOrderValue - $prevAvgOrderValue) / $prevAvgOrderValue) * 100 : 0;
        $newCustomersTrend = $prevNewCustomers > 0 ? (($newCustomers - $prevNewCustomers) / $prevNewCustomers) * 100 : 0;
        $ratingTrend = $prevAvgRating > 0 ? (($avgRating - $prevAvgRating) / $prevAvgRating) * 100 : 0;

        // ===== REVENUE AND ORDERS OVER TIME (daily breakdown) =====

        $revenueOverTime = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(order_value) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // ===== TOP 5 PRODUCTS BY REVENUE =====

        $topProducts = $this->getTopProductsByRevenue($start, $end, 5);

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
                    'avg_order_value' => [
                        'value' => round($avgOrderValue, 2),
                        'trend' => round($avgOrderValueTrend, 2),
                        'label' => 'Average Order Value'
                    ],
                    'new_customers' => [
                        'value' => $newCustomers,
                        'trend' => round($newCustomersTrend, 2),
                        'label' => 'New Customers'
                    ],
                    'returning_customer_percent' => [
                        'value' => round($returningCustomerPercent, 1),
                        'trend' => 0,
                        'label' => 'Returning Customer %'
                    ],
                    'avg_rating' => [
                        'value' => round($avgRating, 2),
                        'trend' => round($ratingTrend, 2),
                        'label' => 'Average Rating'
                    ],
                ],
                'revenue_over_time' => $revenueOverTime,
                'customer_segments' => [
                    'new' => $newCustomers,
                    'returning' => $returningCustomers
                ],
                'top_products' => $topProducts,
            ],
            'date_range' => [
                'start' => $start->format('Y-m-d'),
                'end' => $end->format('Y-m-d'),
            ]
        ]);
    }

    /**
     * Get top products by revenue from JSON order_items
     *
     * Aggregates product sales data from order_items JSON field.
     * Calculates total revenue and units sold per product.
     *
     * @param Carbon $start - Start date
     * @param Carbon $end - End date
     * @param int $limit - Number of top products to return
     * @return \Illuminate\Support\Collection
     */
    private function getTopProductsByRevenue($start, $end, $limit = 10)
    {
        // Get all paid orders in the date range
        $orders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->select('id', 'order_items')
            ->get();

        \Log::info('Top Products Debug', [
            'orders_count' => $orders->count(),
            'start_date' => $start,
            'end_date' => $end
        ]);

        // Aggregate products from JSON order_items field
        $productStats = [];

        foreach ($orders as $order) {
            $items = $order->order_items ?? [];

            foreach ($items as $item) {
                // The field is 'id' not 'product_id' in the actual JSON structure
                $productId = $item['id'] ?? $item['product_id'] ?? null;
                if (!$productId) {
                    Log::warning('Missing product id in item', ['item' => $item]);
                    continue;
                }

                $quantity = $item['quantity'] ?? 0;
                $price = $item['price'] ?? 0;
                $revenue = $quantity * $price;

                // Initialize product stats if not exists
                if (!isset($productStats[$productId])) {
                    // Fetch product name from database since it's not in the JSON
                    $product = Product::find($productId);
                    
                    $productStats[$productId] = [
                        'id' => $productId,
                        'name' => $product ? $product->name : ($item['name'] ?? 'Unknown Product'),
                        'revenue' => 0,
                        'units_sold' => 0,
                    ];
                }

                // Accumulate revenue and units
                $productStats[$productId]['revenue'] += $revenue;
                $productStats[$productId]['units_sold'] += $quantity;
            }
        }

        \Log::info('Product Stats', ['stats' => $productStats]);

        // Sort by revenue (descending) and limit
        usort($productStats, function($a, $b) {
            return $b['revenue'] <=> $a['revenue'];
        });

        return collect(array_slice($productStats, 0, $limit));
    }
}
