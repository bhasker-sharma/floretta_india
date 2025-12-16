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
use Illuminate\Support\Facades\Log;
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

        // ===== SALES BY DATE =====
        // Shows sales for each date that has orders in the filtered range
        // Only includes dates with actual orders

        $salesByDay = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(order_value) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->whereBetween('created_at', [$start, $end])
            ->where('status', 'paid')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'revenue' => (float) $item->revenue,
                    'orders' => (int) $item->orders
                ];
            });

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
                // Try both 'id' and 'product_id' keys
                $pid = $item['id'] ?? $item['product_id'] ?? null;
                if ($pid) {
                    $productIds[] = $pid;
                }
            }
        }

        \Log::info('Product IDs extracted from orders', [
            'product_ids' => array_unique($productIds),
            'sample_order_item' => isset($orders[0]) ? ($orders[0]->order_items[0] ?? null) : null
        ]);

        // Get product details (flag used as category: perfume, freshener, facemist)
        $uniqueProductIds = array_unique($productIds);
        $products = Product::whereIn('id', $uniqueProductIds)
            ->select('id', 'flag', 'item_form', 'name', 'scent')
            ->get()
            ->keyBy('id');

        \Log::info('Category Debug - Products fetched', [
            'unique_product_ids_queried' => $uniqueProductIds,
            'count' => $products->count(),
            'all_products' => $products->map(fn($p) => [
                'id' => $p->id,
                'flag' => $p->flag,
                'item_form' => $p->item_form,
                'scent' => $p->scent,
                'name' => $p->name
            ])
        ]);

        // Aggregate sales by category
        $categoryStats = [];

        foreach ($orders as $order) {
            $items = $order->order_items ?? [];

            foreach ($items as $item) {
                $productId = $item['id'] ?? $item['product_id'] ?? null;
                if (!$productId) continue;

                $product = $products->get($productId);

                // Normalize category to one of: perfume, freshener, facemist
                $category = 'Uncategorized';

                if ($product) {
                    // Try flag field first (primary source)
                    $flagValue = strtolower(trim($product->flag ?? ''));

                    if (!empty($flagValue)) {
                        // Normalize flag values
                        if (in_array($flagValue, ['perfume', 'perfumes'])) {
                            $category = 'perfume';
                        } elseif (in_array($flagValue, ['freshener', 'freshner', 'air freshener', 'car freshener'])) {
                            $category = 'freshener';
                        } elseif (in_array($flagValue, ['facemist', 'face_mist', 'face mist', 'mist'])) {
                            $category = 'face_mist';
                        } else {
                            // Use the flag value as-is if it doesn't match known categories
                            $category = $flagValue;
                        }
                    } else {
                        // Fallback 1: Try item_form
                        $itemForm = strtolower(trim($product->item_form ?? ''));
                        if (!empty($itemForm)) {
                            if (strpos($itemForm, 'perfume') !== false) {
                                $category = 'perfume';
                            } elseif (strpos($itemForm, 'freshener') !== false || strpos($itemForm, 'freshner') !== false) {
                                $category = 'freshener';
                            } elseif (strpos($itemForm, 'mist') !== false) {
                                $category = 'face_mist';
                            }
                        }

                        // Fallback 2: Extract from product name
                        if ($category === 'Uncategorized' && !empty($product->name)) {
                            $name = strtolower($product->name);
                            if (stripos($name, 'perfume') !== false) {
                                $category = 'perfume';
                            } elseif (stripos($name, 'freshener') !== false || stripos($name, 'freshner') !== false) {
                                $category = 'freshener';
                            } elseif (stripos($name, 'face mist') !== false || stripos($name, 'mist') !== false) {
                                $category = 'face_mist';
                            }
                        }
                    }
                }

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
                $productId = $item['id'] ?? $item['product_id'] ?? null;
                if (!$productId) continue;

                $product = $products->get($productId);

                // Use same normalization logic
                $category = 'Uncategorized';

                if ($product) {
                    $flagValue = strtolower(trim($product->flag ?? ''));

                    if (!empty($flagValue)) {
                        if (in_array($flagValue, ['perfume', 'perfumes'])) {
                            $category = 'perfume';
                        } elseif (in_array($flagValue, ['freshener', 'freshner', 'air freshener', 'car freshener'])) {
                            $category = 'freshener';
                        } elseif (in_array($flagValue, ['facemist', 'face_mist', 'face mist', 'mist'])) {
                            $category = 'face_mist';
                        } else {
                            $category = $flagValue;
                        }
                    } else {
                        $itemForm = strtolower(trim($product->item_form ?? ''));
                        if (!empty($itemForm)) {
                            if (strpos($itemForm, 'perfume') !== false) {
                                $category = 'perfume';
                            } elseif (strpos($itemForm, 'freshener') !== false || strpos($itemForm, 'freshner') !== false) {
                                $category = 'freshener';
                            } elseif (strpos($itemForm, 'mist') !== false) {
                                $category = 'face_mist';
                            }
                        }

                        if ($category === 'Uncategorized' && !empty($product->name)) {
                            $name = strtolower($product->name);
                            if (stripos($name, 'perfume') !== false) {
                                $category = 'perfume';
                            } elseif (stripos($name, 'freshener') !== false || stripos($name, 'freshner') !== false) {
                                $category = 'freshener';
                            } elseif (stripos($name, 'face mist') !== false || stripos($name, 'mist') !== false) {
                                $category = 'face_mist';
                            }
                        }
                    }
                }

                $categoriesInOrder[$category] = true;
            }

            // Increment order count for each unique category in this order
            foreach (array_keys($categoriesInOrder) as $category) {
                if (isset($categoryStats[$category])) {
                    $categoryStats[$category]['orders']++;
                }
            }
        }

        Log::info('Category Debug - Final Stats', [
            'categories' => array_keys($categoryStats),
            'stats' => $categoryStats
        ]);

        // Ensure all three main categories always exist (with 0 values if no data)
        $defaultCategories = ['perfume', 'freshener', 'face_mist'];
        foreach ($defaultCategories as $cat) {
            if (!isset($categoryStats[$cat])) {
                $categoryStats[$cat] = [
                    'category' => $cat,
                    'revenue' => 0,
                    'units_sold' => 0,
                    'orders' => 0,
                ];
            }
        }

        // Sort by revenue (descending), but keep consistent order for categories with 0 revenue
        usort($categoryStats, function($a, $b) {
            // If both have same revenue, maintain consistent category order
            if ($a['revenue'] == $b['revenue']) {
                $order = ['perfume' => 1, 'freshener' => 2, 'face_mist' => 3];
                $aOrder = $order[$a['category']] ?? 999;
                $bOrder = $order[$b['category']] ?? 999;
                return $aOrder <=> $bOrder;
            }
            return $b['revenue'] <=> $a['revenue'];
        });

        return collect($categoryStats);
    }
}
