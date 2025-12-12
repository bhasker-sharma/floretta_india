<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use App\Models\ProductReview;
use App\Models\productpage\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Get overview analytics data
     */
    public function getOverview(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->startOfDay());
        $endDate = $request->input('end_date', Carbon::now()->endOfDay());

        // Parse dates
        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        // Calculate previous period for comparison
        $daysDiff = $start->diffInDays($end);
        $prevStart = $start->copy()->subDays($daysDiff + 1);
        $prevEnd = $start->copy()->subDay();

        // Current period metrics
        $currentOrders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->get();

        $totalRevenue = $currentOrders->sum('order_value');
        $totalOrders = $currentOrders->count();
        $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        // New vs returning customers
        $newCustomers = User::whereBetween('created_at', [$start, $end])->count();
        $returningCustomers = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->whereHas('user', function($q) use ($start) {
                $q->where('created_at', '<', $start);
            })
            ->distinct('user_id')
            ->count('user_id');

        $totalCustomers = $newCustomers + $returningCustomers;
        $returningCustomerPercent = $totalCustomers > 0 ? ($returningCustomers / $totalCustomers) * 100 : 0;

        // Previous period metrics for trends
        $prevOrders = Order::whereBetween('created_at', [$prevStart, $prevEnd])
            ->where('status', 'paid')
            ->get();

        $prevRevenue = $prevOrders->sum('order_value');
        $prevOrderCount = $prevOrders->count();
        $prevAvgOrderValue = $prevOrderCount > 0 ? $prevRevenue / $prevOrderCount : 0;
        $prevNewCustomers = User::whereBetween('created_at', [$prevStart, $prevEnd])->count();

        // Calculate trends (percentage change)
        $revenueTrend = $prevRevenue > 0 ? (($totalRevenue - $prevRevenue) / $prevRevenue) * 100 : 0;
        $ordersTrend = $prevOrderCount > 0 ? (($totalOrders - $prevOrderCount) / $prevOrderCount) * 100 : 0;
        $avgOrderValueTrend = $prevAvgOrderValue > 0 ? (($avgOrderValue - $prevAvgOrderValue) / $prevAvgOrderValue) * 100 : 0;
        $newCustomersTrend = $prevNewCustomers > 0 ? (($newCustomers - $prevNewCustomers) / $prevNewCustomers) * 100 : 0;

        // Revenue and orders over time (daily breakdown)
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

        // Top 5 products by revenue - Parse JSON order_items
        $topProducts = $this->getTopProductsByRevenue($start, $end, 5);

        // Latest orders
        $latestOrders = Order::with('user')
            ->whereBetween('created_at', [$start, $end])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($order) {
                $items = $order->order_items ?? [];

                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number ?? 'ORD-' . $order->id,
                    'date' => $order->created_at->format('Y-m-d H:i:s'),
                    'customer' => $order->customer_name ?? ($order->user->name ?? 'Guest'),
                    'customer_email' => $order->customer_email ?? ($order->user->email ?? 'N/A'),
                    'items_count' => count($items),
                    'total' => $order->order_value,
                    'payment_status' => $order->status,
                    'fulfillment_status' => $order->order_status,
                ];
            });

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
                ],
                'revenue_over_time' => $revenueOverTime,
                'customer_segments' => [
                    'new' => $newCustomers,
                    'returning' => $returningCustomers
                ],
                'top_products' => $topProducts,
                'latest_orders' => $latestOrders,
            ],
            'date_range' => [
                'start' => $start->format('Y-m-d'),
                'end' => $end->format('Y-m-d'),
            ]
        ]);
    }

    /**
     * Get sales analytics
     */
    public function getSalesAnalytics(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->startOfDay());
        $endDate = $request->input('end_date', Carbon::now()->endOfDay());

        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        // Calculate previous period
        $daysDiff = $start->diffInDays($end);
        $prevStart = $start->copy()->subDays($daysDiff + 1);
        $prevEnd = $start->copy()->subDay();

        // Current period metrics
        $currentOrders = Order::whereBetween('created_at', [$start, $end])->where('status', 'paid')->get();
        $totalRevenue = $currentOrders->sum('order_value');
        $totalOrders = $currentOrders->count();

        $allOrders = Order::whereBetween('created_at', [$start, $end])->count();
        $conversionRate = $allOrders > 0 ? ($totalOrders / $allOrders) * 100 : 0;

        $refundedOrders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'refunded')
            ->count();

        // Previous period for trends
        $prevOrders = Order::whereBetween('created_at', [$prevStart, $prevEnd])->where('status', 'paid')->get();
        $prevRevenue = $prevOrders->sum('order_value');
        $prevOrderCount = $prevOrders->count();

        $prevAllOrders = Order::whereBetween('created_at', [$prevStart, $prevEnd])->count();
        $prevConversionRate = $prevAllOrders > 0 ? ($prevOrderCount / $prevAllOrders) * 100 : 0;

        $prevRefunded = Order::whereBetween('created_at', [$prevStart, $prevEnd])
            ->where('status', 'refunded')
            ->count();

        // Calculate trends
        $revenueTrend = $prevRevenue > 0 ? (($totalRevenue - $prevRevenue) / $prevRevenue) * 100 : 0;
        $ordersTrend = $prevOrderCount > 0 ? (($totalOrders - $prevOrderCount) / $prevOrderCount) * 100 : 0;
        $conversionTrend = $prevConversionRate > 0 ? (($conversionRate - $prevConversionRate) / $prevConversionRate) * 100 : 0;
        $refundedTrend = $prevRefunded > 0 ? (($refundedOrders - $prevRefunded) / $prevRefunded) * 100 : 0;

        // Sales by day
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

        // Sales by category - Parse JSON order_items and aggregate
        $salesByCategory = $this->getSalesByCategory($start, $end);

        // Sales by payment method - Note: there's no payment_method column in the actual schema
        // Using razorpay as the only payment method
        $salesByPaymentMethod = collect([
            [
                'payment_method' => 'Razorpay',
                'orders' => $totalOrders,
                'revenue' => $totalRevenue
            ]
        ]);

        // Sales by status
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
     * Get product analytics
     */
    public function getProductAnalytics(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->startOfDay());
        $endDate = $request->input('end_date', Carbon::now()->endOfDay());
        $productId = $request->input('product_id');
        $category = $request->input('category');
        $stockStatus = $request->input('stock_status');
        $topN = $request->input('top_n', 10);

        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        // KPIs
        $totalActiveProducts = Product::count(); // All products (no is_active column)
        $outOfStockProducts = Product::where('available_quantity', '<=', 0)->count();

        // Top product this period
        $topProductsData = $this->getTopProductsByRevenue($start, $end, 1);
        $topProduct = $topProductsData->isNotEmpty() ? $topProductsData->first()->name : 'N/A';

        // Total returns
        $totalReturns = Order::whereBetween('created_at', [$start, $end])
            ->where('order_status', 'returned')
            ->count();

        // Previous period KPIs for trends
        $daysDiff = $start->diffInDays($end);
        $prevStart = $start->copy()->subDays($daysDiff + 1);
        $prevEnd = $start->copy()->subDay();

        $prevActiveProducts = Product::where('created_at', '<=', $prevEnd)
            ->count();
        $prevOutOfStock = Product::where('available_quantity', '<=', 0)
            ->where('updated_at', '<=', $prevEnd)
            ->count();
        $prevReturns = Order::whereBetween('created_at', [$prevStart, $prevEnd])
            ->where('order_status', 'returned')
            ->count();

        // Calculate trends
        $activeProductsTrend = $prevActiveProducts > 0 ? (($totalActiveProducts - $prevActiveProducts) / $prevActiveProducts) * 100 : 0;
        $outOfStockTrend = $prevOutOfStock > 0 ? (($outOfStockProducts - $prevOutOfStock) / $prevOutOfStock) * 100 : 0;
        $returnsTrend = $prevReturns > 0 ? (($totalReturns - $prevReturns) / $prevReturns) * 100 : 0;

        // Top products by revenue
        $topProductsQuery = $this->getTopProductsByRevenue($start, $end, $topN);

        // Product performance table
        $productPerformance = $this->getProductPerformance($start, $end, $category, $stockStatus);

        // Low stock products
        $lowStockProducts = Product::where('available_quantity', '>', 0)
            ->where('available_quantity', '<', 5)
            ->select('id', 'name', 'scent', 'brand', 'available_quantity', 'price')
            ->get()
            ->map(function($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->scent ?? $product->brand ?? 'N/A',
                    'stock' => $product->available_quantity,
                    'price' => $product->price,
                ];
            });

        // Category performance
        $categoryPerformance = $this->getSalesByCategory($start, $end);

        return response()->json([
            'success' => true,
            'data' => [
                'kpis' => [
                    'total_active_products' => [
                        'value' => $totalActiveProducts,
                        'trend' => round($activeProductsTrend, 2),
                        'label' => 'Total Active Products'
                    ],
                    'out_of_stock_items' => [
                        'value' => $outOfStockProducts,
                        'trend' => round($outOfStockTrend, 2),
                        'label' => 'Out of Stock Items'
                    ],
                    'top_product' => [
                        'value' => $topProduct,
                        'trend' => 0,
                        'label' => 'Top Product (This Period)'
                    ],
                    'total_returns' => [
                        'value' => $totalReturns,
                        'trend' => round($returnsTrend, 2),
                        'label' => 'Total Returns'
                    ],
                ],
                'top_products' => $topProductsQuery,
                'product_performance' => $productPerformance,
                'low_stock_products' => $lowStockProducts,
                'category_performance' => $categoryPerformance,
            ]
        ]);
    }

    /**
     * Get customer analytics
     */
    public function getCustomerAnalytics(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->startOfDay());
        $endDate = $request->input('end_date', Carbon::now()->endOfDay());

        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        // Calculate previous period
        $daysDiff = $start->diffInDays($end);
        $prevStart = $start->copy()->subDays($daysDiff + 1);
        $prevEnd = $start->copy()->subDay();

        // KPIs - Current period
        $totalCustomers = User::count();
        $newCustomers = User::whereBetween('created_at', [$start, $end])->count();

        $returningCustomers = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->whereHas('user', function($q) use ($start) {
                $q->where('created_at', '<', $start);
            })
            ->distinct('user_id')
            ->count('user_id');

        $totalPeriodCustomers = $newCustomers + $returningCustomers;
        $returningCustomerRate = $totalPeriodCustomers > 0 ? ($returningCustomers / $totalPeriodCustomers) * 100 : 0;

        $totalOrders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->count();
        $avgOrdersPerCustomer = $totalPeriodCustomers > 0 ? $totalOrders / $totalPeriodCustomers : 0;

        // Previous period KPIs
        $prevNewCustomers = User::whereBetween('created_at', [$prevStart, $prevEnd])->count();
        $prevReturningCustomers = Order::whereBetween('created_at', [$prevStart, $prevEnd])
            ->where('status', 'paid')
            ->whereHas('user', function($q) use ($prevStart) {
                $q->where('created_at', '<', $prevStart);
            })
            ->distinct('user_id')
            ->count('user_id');

        $prevTotalPeriodCustomers = $prevNewCustomers + $prevReturningCustomers;
        $prevReturningRate = $prevTotalPeriodCustomers > 0 ? ($prevReturningCustomers / $prevTotalPeriodCustomers) * 100 : 0;

        $prevOrders = Order::whereBetween('created_at', [$prevStart, $prevEnd])->where('status', 'paid')->count();
        $prevAvgOrdersPerCustomer = $prevTotalPeriodCustomers > 0 ? $prevOrders / $prevTotalPeriodCustomers : 0;

        // Calculate trends
        $newCustomersTrend = $prevNewCustomers > 0 ? (($newCustomers - $prevNewCustomers) / $prevNewCustomers) * 100 : 0;
        $returningRateTrend = $prevReturningRate > 0 ? (($returningCustomerRate - $prevReturningRate) / $prevReturningRate) * 100 : 0;
        $avgOrdersTrend = $prevAvgOrdersPerCustomer > 0 ? (($avgOrdersPerCustomer - $prevAvgOrdersPerCustomer) / $prevAvgOrdersPerCustomer) * 100 : 0;

        // New vs Returning over time
        $customerSegmentsOverTime = DB::table('orders')
            ->join('users', 'orders.user_id', '=', 'users.id')
            ->select(
                DB::raw('DATE(orders.created_at) as date'),
                DB::raw('COUNT(DISTINCT CASE WHEN users.created_at >= \'' . $start . '\' THEN users.id END) as new'),
                DB::raw('COUNT(DISTINCT CASE WHEN users.created_at < \'' . $start . '\' THEN users.id END) as returning')
            )
            ->whereBetween('orders.created_at', [$start, $end])
            ->where('orders.status', 'paid')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top customers by revenue
        $topCustomers = Order::select(
                'user_id',
                'users.name',
                'users.email',
                DB::raw('COUNT(orders.id) as total_orders'),
                DB::raw('SUM(orders.order_value) as total_spent'),
                DB::raw('AVG(orders.order_value) as avg_order_value'),
                DB::raw('MAX(orders.created_at) as last_order_date')
            )
            ->join('users', 'orders.user_id', '=', 'users.id')
            ->whereBetween('orders.created_at', [$start, $end])
            ->where('orders.status', 'paid')
            ->groupBy('user_id', 'users.name', 'users.email')
            ->orderByDesc('total_spent')
            ->limit(10)
            ->get();

        // Customer registration over time
        $customerGrowth = User::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as new_customers')
            )
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Orders by location - Extract from customer_address JSON
        $ordersByLocation = $this->getOrdersByLocation($start, $end);

        return response()->json([
            'success' => true,
            'data' => [
                'kpis' => [
                    'total_customers' => [
                        'value' => $totalCustomers,
                        'trend' => 0,
                        'label' => 'Total Customers'
                    ],
                    'new_customers' => [
                        'value' => $newCustomers,
                        'trend' => round($newCustomersTrend, 2),
                        'label' => 'New Customers (Period)'
                    ],
                    'returning_customer_rate' => [
                        'value' => round($returningCustomerRate, 1),
                        'trend' => round($returningRateTrend, 2),
                        'label' => 'Returning Customer Rate'
                    ],
                    'avg_orders_per_customer' => [
                        'value' => round($avgOrdersPerCustomer, 2),
                        'trend' => round($avgOrdersTrend, 2),
                        'label' => 'Avg Orders per Customer'
                    ],
                ],
                'customer_segments_over_time' => $customerSegmentsOverTime,
                'top_customers' => $topCustomers,
                'customer_growth' => $customerGrowth,
                'orders_by_location' => $ordersByLocation,
            ]
        ]);
    }

    /**
     * Get review analytics
     * Note: Reviews feature is not yet implemented
     */
    public function getReviewAnalytics(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->startOfDay());
        $endDate = $request->input('end_date', Carbon::now()->endOfDay());
        $search = $request->input('search', '');
        $status = $request->input('status', '');
        $rating = $request->input('rating', '');
        $productId = $request->input('product_id', '');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $perPage = $request->input('per_page', 15);

        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        // Calculate previous period
        $daysDiff = $start->diffInDays($end);
        $prevStart = $start->copy()->subDays($daysDiff + 1);
        $prevEnd = $start->copy()->subDay();

        // Current period metrics
        $currentReviews = ProductReview::whereBetween('created_at', [$start, $end])->get();
        $totalReviews = $currentReviews->count();
        $avgRating = $currentReviews->avg('rating') ?? 0;
        $fiveStarCount = $currentReviews->where('rating', 5)->count();
        $fiveStarPercent = $totalReviews > 0 ? ($fiveStarCount / $totalReviews) * 100 : 0;
        $lowStarCount = $currentReviews->whereIn('rating', [1, 2])->count();
        $lowStarPercent = $totalReviews > 0 ? ($lowStarCount / $totalReviews) * 100 : 0;

        // Previous period for trends
        $prevReviews = ProductReview::whereBetween('created_at', [$prevStart, $prevEnd])->get();
        $prevTotalReviews = $prevReviews->count();
        $prevAvgRating = $prevReviews->avg('rating') ?? 0;
        $prevFiveStarCount = $prevReviews->where('rating', 5)->count();
        $prevFiveStarPercent = $prevTotalReviews > 0 ? ($prevFiveStarCount / $prevTotalReviews) * 100 : 0;
        $prevLowStarCount = $prevReviews->whereIn('rating', [1, 2])->count();
        $prevLowStarPercent = $prevTotalReviews > 0 ? ($prevLowStarCount / $prevTotalReviews) * 100 : 0;

        // Calculate trends
        $reviewsTrend = $prevTotalReviews > 0 ? (($totalReviews - $prevTotalReviews) / $prevTotalReviews) * 100 : 0;
        $ratingTrend = $prevAvgRating > 0 ? (($avgRating - $prevAvgRating) / $prevAvgRating) * 100 : 0;
        $fiveStarTrend = $prevFiveStarPercent > 0 ? (($fiveStarPercent - $prevFiveStarPercent) / $prevFiveStarPercent) * 100 : 0;
        $lowStarTrend = $prevLowStarPercent > 0 ? (($lowStarPercent - $prevLowStarPercent) / $prevLowStarPercent) * 100 : 0;

        // Rating distribution
        $ratingDistribution = ProductReview::whereBetween('created_at', [$start, $end])
            ->select('rating', DB::raw('COUNT(*) as count'))
            ->groupBy('rating')
            ->orderBy('rating', 'desc')
            ->get()
            ->map(function($item) {
                return [
                    'rating' => $item->rating . ' Stars',
                    'count' => $item->count,
                ];
            });

        // Reviews over time
        $reviewsOverTime = ProductReview::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as reviews'),
                DB::raw('AVG(rating) as avg_rating')
            )
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top reviewed products
        $topReviewedProducts = ProductReview::select('product_id', DB::raw('COUNT(*) as review_count'))
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('product_id')
            ->orderBy('review_count', 'desc')
            ->limit(10)
            ->with('product:id,name')
            ->get()
            ->map(function($item) {
                return [
                    'product_name' => $item->product->name ?? 'Unknown Product',
                    'review_count' => $item->review_count,
                ];
            });

        // Recent reviews with filters
        $reviewsQuery = ProductReview::with(['product:id,name', 'user:id,name,email'])
            ->whereBetween('created_at', [$start, $end]);

        if ($search) {
            $reviewsQuery->where(function($q) use ($search) {
                $q->where('review', 'like', "%{$search}%")
                  ->orWhere('review_text', 'like', "%{$search}%")
                  ->orWhere('user_name', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $reviewsQuery->where('status', $status);
        }

        if ($rating) {
            $reviewsQuery->where('rating', $rating);
        }

        if ($productId) {
            $reviewsQuery->where('product_id', $productId);
        }

        $recentReviews = $reviewsQuery
            ->orderBy($sortBy, $sortOrder)
            ->paginate($perPage);

        $recentReviews->getCollection()->transform(function($review) {
            return [
                'id' => $review->id,
                'product_name' => $review->product->name ?? 'Unknown Product',
                'rating' => $review->rating,
                'comment' => $review->review_text ?? $review->review ?? '',
                'customer_name' => $review->user->name ?? $review->user_name ?? 'Anonymous',
                'customer_email' => $review->user->email ?? 'N/A',
                'date' => $review->created_at->format('Y-m-d H:i:s'),
                'status' => $review->status ?? 'approved',
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'kpis' => [
                    'total_reviews' => [
                        'value' => $totalReviews,
                        'trend' => round($reviewsTrend, 2),
                        'label' => 'Total Reviews',
                    ],
                    'avg_rating' => [
                        'value' => round($avgRating, 2),
                        'trend' => round($ratingTrend, 2),
                        'label' => 'Average Rating',
                    ],
                    'five_star_percent' => [
                        'value' => round($fiveStarPercent, 1),
                        'trend' => round($fiveStarTrend, 2),
                        'label' => '5-Star Reviews',
                    ],
                    'low_star_percent' => [
                        'value' => round($lowStarPercent, 1),
                        'trend' => round($lowStarTrend, 2),
                        'label' => '1-2 Star Reviews',
                    ],
                ],
                'rating_distribution' => $ratingDistribution,
                'reviews_over_time' => $reviewsOverTime,
                'top_reviewed_products' => $topReviewedProducts,
                'recent_reviews' => $recentReviews->items(),
            ],
        ]);
    }

    /**
     * Get all orders with filters (for the orders table)
     */
    public function getOrders(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->startOfDay());
        $endDate = $request->input('end_date', Carbon::now()->endOfDay());
        $search = $request->input('search', '');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $perPage = $request->input('per_page', 15);

        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        $query = Order::with('user')
            ->whereBetween('created_at', [$start, $end]);

        // Search
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

        // Sort
        $orders = $query->orderBy($sortBy, $sortOrder)->paginate($perPage);

        $orders->getCollection()->transform(function ($order) {
            $items = $order->order_items ?? [];
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

    /**
     * Helper method to get top products by revenue from JSON order_items
     */
    private function getTopProductsByRevenue($start, $end, $limit = 10)
    {
        $orders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->select('id', 'order_items')
            ->get();

        // Aggregate products from JSON
        $productStats = [];

        foreach ($orders as $order) {
            $items = $order->order_items ?? [];

            foreach ($items as $item) {
                $productId = $item['product_id'] ?? null;
                if (!$productId) continue;

                $quantity = $item['quantity'] ?? 0;
                $price = $item['price'] ?? 0;
                $revenue = $quantity * $price;

                if (!isset($productStats[$productId])) {
                    $productStats[$productId] = [
                        'id' => $productId,
                        'name' => $item['name'] ?? 'Unknown Product',
                        'revenue' => 0,
                        'units_sold' => 0,
                    ];
                }

                $productStats[$productId]['revenue'] += $revenue;
                $productStats[$productId]['units_sold'] += $quantity;
            }
        }

        // Sort by revenue and limit
        usort($productStats, function($a, $b) {
            return $b['revenue'] <=> $a['revenue'];
        });

        return collect(array_slice($productStats, 0, $limit));
    }

    /**
     * Helper method to get sales by category from JSON order_items
     */
    private function getSalesByCategory($start, $end)
    {
        $orders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->select('id', 'order_items')
            ->get();

        // Get all product IDs from orders
        $productIds = [];
        foreach ($orders as $order) {
            $items = $order->order_items ?? [];
            foreach ($items as $item) {
                if (isset($item['product_id'])) {
                    $productIds[] = $item['product_id'];
                }
            }
        }

        // Get product scents (using scent as category since category column doesn't exist)
        $products = Product::whereIn('id', array_unique($productIds))
            ->select('id', 'scent', 'brand')
            ->get()
            ->keyBy('id');

        // Aggregate by scent (using scent as category)
        $categoryStats = [];

        foreach ($orders as $order) {
            $items = $order->order_items ?? [];

            foreach ($items as $item) {
                $productId = $item['product_id'] ?? null;
                if (!$productId) continue;

                $product = $products->get($productId);
                // Use scent as category, or brand as fallback
                $category = $product ? ($product->scent ?? $product->brand ?? 'Uncategorized') : 'Uncategorized';

                $quantity = $item['quantity'] ?? 0;
                $price = $item['price'] ?? 0;
                $revenue = $quantity * $price;

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
                // Use scent as category, or brand as fallback
                $category = $product ? ($product->scent ?? $product->brand ?? 'Uncategorized') : 'Uncategorized';
                $categoriesInOrder[$category] = true;
            }

            foreach (array_keys($categoriesInOrder) as $category) {
                if (isset($categoryStats[$category])) {
                    $categoryStats[$category]['orders']++;
                }
            }
        }

        // Sort by revenue
        usort($categoryStats, function($a, $b) {
            return $b['revenue'] <=> $a['revenue'];
        });

        return collect($categoryStats);
    }

    /**
     * Helper method to get product performance
     */
    private function getProductPerformance($start, $end, $category = null, $stockStatus = null)
    {
        $orders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->select('id', 'order_items', 'created_at')
            ->get();

        // Aggregate product sales
        $productSales = [];

        foreach ($orders as $order) {
            $items = $order->order_items ?? [];

            foreach ($items as $item) {
                $productId = $item['product_id'] ?? null;
                if (!$productId) continue;

                $quantity = $item['quantity'] ?? 0;
                $price = $item['price'] ?? 0;
                $revenue = $quantity * $price;

                if (!isset($productSales[$productId])) {
                    $productSales[$productId] = [
                        'units_sold' => 0,
                        'revenue' => 0,
                        'last_sale_date' => null,
                    ];
                }

                $productSales[$productId]['units_sold'] += $quantity;
                $productSales[$productId]['revenue'] += $revenue;

                if (!$productSales[$productId]['last_sale_date'] ||
                    $order->created_at > $productSales[$productId]['last_sale_date']) {
                    $productSales[$productId]['last_sale_date'] = $order->created_at;
                }
            }
        }

        // Get all products
        $productsQuery = Product::select('id', 'name', 'scent', 'brand', 'available_quantity', 'price');

        if ($category) {
            // Filter by scent or brand since category column doesn't exist
            $productsQuery->where(function($q) use ($category) {
                $q->where('scent', $category)
                  ->orWhere('brand', $category);
            });
        }

        if ($stockStatus === 'in_stock') {
            $productsQuery->where('available_quantity', '>', 5);
        } elseif ($stockStatus === 'low_stock') {
            $productsQuery->where('available_quantity', '>', 0)->where('available_quantity', '<=', 5);
        } elseif ($stockStatus === 'out_of_stock') {
            $productsQuery->where('available_quantity', '<=', 0);
        }

        $products = $productsQuery->get();

        // Combine data
        return $products->map(function($product) use ($productSales) {
            $sales = $productSales[$product->id] ?? ['units_sold' => 0, 'revenue' => 0, 'last_sale_date' => null];

            $daysSinceLastSale = $sales['last_sale_date']
                ? Carbon::parse($sales['last_sale_date'])->diffInDays(Carbon::now())
                : null;

            return [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->scent ?? $product->brand ?? 'N/A',
                'stock' => $product->available_quantity ?? 0,
                'price' => $product->price,
                'units_sold' => $sales['units_sold'],
                'revenue' => $sales['revenue'],
                'avg_rating' => 0, // Reviews feature not yet implemented
                'last_sale_date' => $sales['last_sale_date'] ? $sales['last_sale_date']->format('Y-m-d H:i:s') : null,
                'days_since_last_sale' => $daysSinceLastSale,
            ];
        });
    }

    /**
     * Helper method to get orders by location from customer_address
     */
    private function getOrdersByLocation($start, $end)
    {
        $orders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->select('id', 'customer_address', 'order_value')
            ->get();

        $locationStats = [];

        foreach ($orders as $order) {
            $address = $order->customer_address;
            $city = 'Unknown';

            // Try to extract city from address (assuming it's a string or JSON)
            if (is_string($address)) {
                // If it's JSON string, try to parse it
                $addressData = json_decode($address, true);
                if ($addressData && isset($addressData['city'])) {
                    $city = $addressData['city'];
                } else {
                    // If it's a plain string, try to extract city (basic extraction)
                    // This is a simple approach - you might need to adjust based on actual format
                    $parts = explode(',', $address);
                    if (count($parts) >= 2) {
                        $city = trim($parts[count($parts) - 2]); // Assuming city is second-to-last
                    }
                }
            }

            if (!isset($locationStats[$city])) {
                $locationStats[$city] = [
                    'city' => $city,
                    'orders' => 0,
                    'revenue' => 0,
                ];
            }

            $locationStats[$city]['orders']++;
            $locationStats[$city]['revenue'] += $order->order_value;
        }

        // Sort by orders
        usort($locationStats, function($a, $b) {
            return $b['orders'] <=> $a['orders'];
        });

        // Limit to top 10
        return collect(array_slice($locationStats, 0, 10));
    }
}
