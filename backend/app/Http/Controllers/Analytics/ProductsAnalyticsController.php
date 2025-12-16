<?php

/**
 * Products Analytics Controller
 *
 * Handles product performance analytics including:
 * - Product KPIs (active products, out of stock, top product, returns)
 * - Top products by revenue (configurable limit)
 * - Detailed product performance metrics
 * - Low stock alerts for inventory management
 * - Category performance breakdown
 */

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\productpage\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductsAnalyticsController extends Controller
{
    /**
     * Get product analytics data
     *
     * Returns comprehensive product performance metrics with filtering options.
     * Supports filters: category, stock status, search, sort, and pagination.
     *
     * @param Request $request - Contains filters and date range
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Parse parameters
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->startOfDay());
        $endDate = $request->input('end_date', Carbon::now()->endOfDay());
        $category = $request->input('category');
        $stockStatus = $request->input('stock_status');
        $search = $request->input('search', '');
        $sortBy = $request->input('sort_by', 'revenue');
        $sortOrder = $request->input('sort_order', 'desc');
        $topLimit = $request->input('top_limit', 10);
        $perPage = $request->input('per_page', 15);
        $page = $request->input('page', 1);

        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        // Calculate previous period for trends
        $daysDiff = $start->diffInDays($end);
        $prevStart = $start->copy()->subDays($daysDiff + 1);
        $prevEnd = $start->copy()->subDay();

        // ===== KPIs =====

        $totalActiveProducts = Product::count();
        $outOfStockProducts = Product::where('available_quantity', '<=', 0)->count();

        // Top product this period
        $topProductsData = $this->getTopProductsByRevenue($start, $end, 1);
        $topProduct = $topProductsData->isNotEmpty() ? $topProductsData->first()['product_name'] : 'N/A';

        // Total returns
        $totalReturns = Order::whereBetween('created_at', [$start, $end])
            ->where('order_status', 'returned')
            ->count();

        // Previous period KPIs for trends
        $prevActiveProducts = Product::where('created_at', '<=', $prevEnd)->count();
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

        // ===== TOP PRODUCTS BY REVENUE =====

        $topProductsByRevenue = $this->getTopProductsByRevenue($start, $end, $topLimit);

        // ===== PRODUCT PERFORMANCE TABLE (paginated) =====

        $productPerformance = $this->getProductPerformance(
            $start,
            $end,
            $category,
            $stockStatus,
            $search,
            $sortBy,
            $sortOrder,
            $perPage,
            $page
        );

        // ===== LOW STOCK ALERT =====

        $lowStockProducts = Product::where('available_quantity', '>', 0)
            ->where('available_quantity', '<', 5)
            ->select('id', 'name', 'scent', 'brand', 'available_quantity', 'price')
            ->get()
            ->map(function($product) use ($start, $end) {
                // Get units sold for this product in the period
                $unitsSold = $this->getProductSales($product->id, $start, $end)['units_sold'];

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->scent ?? $product->brand ?? 'N/A',
                    'stock' => $product->available_quantity,
                    'units_sold' => $unitsSold,
                ];
            });

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
                'top_products_by_revenue' => $topProductsByRevenue,
                'all_products_revenue' => $this->getAllProductsRevenue($start, $end), // Fetch all products including unsold ones
                'product_performance' => $productPerformance,
                'low_stock_products' => $lowStockProducts,
            ]
        ]);
    }

    /**
     * Get all products with revenue (including unsold products with 0 revenue)
     */
    private function getAllProductsRevenue($start, $end)
    {
        // Get all products from database
        $allProducts = Product::select('id', 'name')->get();

        // Get sales data for the date range
        $orders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->select('id', 'order_items')
            ->get();

        $productStats = [];

        // Calculate sales for sold products
        foreach ($orders as $order) {
            $items = $order->order_items ?? [];

            foreach ($items as $item) {
                $productId = $item['id'] ?? $item['product_id'] ?? null;
                if (!$productId) continue;

                $quantity = $item['quantity'] ?? 0;
                $price = $item['price'] ?? 0;
                $revenue = $quantity * $price;

                if (!isset($productStats[$productId])) {
                    $productStats[$productId] = [
                        'revenue' => 0,
                        'units_sold' => 0,
                    ];
                }

                $productStats[$productId]['revenue'] += $revenue;
                $productStats[$productId]['units_sold'] += $quantity;
            }
        }

        // Build result array with ALL products
        $allProductsData = [];
        foreach ($allProducts as $product) {
            $sales = $productStats[$product->id] ?? ['revenue' => 0, 'units_sold' => 0];

            $allProductsData[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'revenue' => $sales['revenue'],
                'units_sold' => $sales['units_sold'],
            ];
        }

        // Sort by revenue descending (products with 0 revenue will be at the end)
        usort($allProductsData, function($a, $b) {
            return $b['revenue'] <=> $a['revenue'];
        });

        return collect($allProductsData);
    }

    /**
     * Get top products by revenue
     */
    private function getTopProductsByRevenue($start, $end, $limit = 10)
    {
        $orders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->select('id', 'order_items')
            ->get();

        \Log::info('Top Products Debug', [
            'orders_count' => $orders->count(),
            'start_date' => $start->toDateTimeString(),
            'end_date' => $end->toDateTimeString()
        ]);

        $productStats = [];

        foreach ($orders as $order) {
            $items = $order->order_items ?? [];

            foreach ($items as $item) {
                // Try both 'id' and 'product_id' keys
                $productId = $item['id'] ?? $item['product_id'] ?? null;
                if (!$productId) continue;

                $quantity = $item['quantity'] ?? 0;
                $price = $item['price'] ?? 0;
                $revenue = $quantity * $price;

                if (!isset($productStats[$productId])) {
                    $productStats[$productId] = [
                        'product_id' => $productId,
                        'product_name' => $item['name'] ?? 'Unknown Product',
                        'revenue' => 0,
                        'units_sold' => 0,
                    ];
                }

                $productStats[$productId]['revenue'] += $revenue;
                $productStats[$productId]['units_sold'] += $quantity;
            }
        }

        \Log::info('Product Stats', [
            'stats' => $productStats
        ]);

        usort($productStats, function($a, $b) {
            return $b['revenue'] <=> $a['revenue'];
        });

        return collect(array_slice($productStats, 0, $limit));
    }

    /**
     * Get detailed product performance with pagination
     */
    private function getProductPerformance($start, $end, $category, $stockStatus, $search, $sortBy, $sortOrder, $perPage, $page)
    {
        // Get product sales data
        $orders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->select('id', 'order_items', 'created_at')
            ->get();

        $productSales = [];

        foreach ($orders as $order) {
            $items = $order->order_items ?? [];

            foreach ($items as $item) {
                // Try both 'id' and 'product_id' keys
                $productId = $item['id'] ?? $item['product_id'] ?? null;
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

        // Build query with filters
        $productsQuery = Product::select('id', 'name', 'scent', 'brand', 'available_quantity', 'price');

        if ($category) {
            $productsQuery->where(function($q) use ($category) {
                $q->where('scent', $category)->orWhere('brand', $category);
            });
        }

        if ($stockStatus === 'in_stock') {
            $productsQuery->where('available_quantity', '>', 5);
        } elseif ($stockStatus === 'low_stock') {
            $productsQuery->where('available_quantity', '>', 0)->where('available_quantity', '<=', 5);
        } elseif ($stockStatus === 'out_of_stock') {
            $productsQuery->where('available_quantity', '<=', 0);
        }

        if ($search) {
            $productsQuery->where('name', 'like', "%{$search}%");
        }

        $products = $productsQuery->get();

        // Combine with sales data
        $performanceData = $products->map(function($product) use ($productSales) {
            $sales = $productSales[$product->id] ?? ['units_sold' => 0, 'revenue' => 0, 'last_sale_date' => null];

            $daysSinceLastSale = $sales['last_sale_date']
                ? Carbon::parse($sales['last_sale_date'])->diffInDays(Carbon::now())
                : null;

            // Get average rating
            $avgRating = ProductReview::where('product_id', $product->id)->avg('rating') ?? 0;

            return [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->scent ?? $product->brand ?? 'N/A',
                'stock' => $product->available_quantity ?? 0,
                'price' => $product->price,
                'units_sold' => $sales['units_sold'],
                'revenue' => $sales['revenue'],
                'avg_rating' => round($avgRating, 2),
                'days_since_last_sale' => $daysSinceLastSale,
            ];
        });

        // Sort
        $performanceData = $performanceData->sortBy([[$sortBy, $sortOrder === 'desc' ? 'desc' : 'asc']]);

        // Manual pagination
        $total = $performanceData->count();
        $offset = ($page - 1) * $perPage;
        $paginatedData = $performanceData->slice($offset, $perPage)->values();

        return [
            'data' => $paginatedData,
            'total' => $total,
            'per_page' => $perPage,
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
            'from' => $offset + 1,
            'to' => min($offset + $perPage, $total),
        ];
    }

    /**
     * Get sales data for a specific product
     */
    private function getProductSales($productId, $start, $end)
    {
        $orders = Order::whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->select('id', 'order_items')
            ->get();

        $unitsSold = 0;
        $revenue = 0;

        foreach ($orders as $order) {
            $items = $order->order_items ?? [];

            foreach ($items as $item) {
                // Try both 'id' and 'product_id' keys
                $itemProductId = $item['id'] ?? $item['product_id'] ?? null;
                if ($itemProductId == $productId) {
                    $quantity = $item['quantity'] ?? 0;
                    $price = $item['price'] ?? 0;

                    $unitsSold += $quantity;
                    $revenue += $quantity * $price;
                }
            }
        }

        return [
            'units_sold' => $unitsSold,
            'revenue' => $revenue,
        ];
    }
}
