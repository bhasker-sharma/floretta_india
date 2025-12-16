<?php

/**
 * Customers Analytics Controller
 *
 * Handles customer behavior and segmentation analytics including:
 * - Customer KPIs (total, new, returning rate, avg orders per customer)
 * - Customer acquisition trends (new vs returning over time)
 * - Top customers by revenue/spending
 * - Geographic distribution (orders by location)
 * - Customer growth tracking
 */

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CustomersAnalyticsController extends Controller
{
    /**
     * Get customer analytics data
     *
     * Returns comprehensive customer metrics including KPIs with trends,
     * customer segmentation, top customers, and geographic distribution.
     *
     * @param Request $request - Contains filters and date range
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Parse parameters
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->startOfDay());
        $endDate = $request->input('end_date', Carbon::now()->endOfDay());
        $search = $request->input('search', '');
        $status = $request->input('status', '');
        $sortBy = $request->input('sort_by', 'total_spent');
        $sortOrder = $request->input('sort_order', 'desc');
        $perPage = $request->input('per_page', 15);
        $page = $request->input('page', 1);

        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        // Calculate previous period for trends
        $daysDiff = $start->diffInDays($end);
        $prevStart = $start->copy()->subDays($daysDiff + 1);
        $prevEnd = $start->copy()->subDay();

        // ===== CURRENT PERIOD KPIs =====

        $totalCustomers = User::count();
        $newCustomers = User::whereBetween('created_at', [$start, $end])->count();

        // Returning customers: ordered in this period but registered before it
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

        // ===== PREVIOUS PERIOD KPIs =====

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

        // ===== CALCULATE TRENDS =====

        $newCustomersTrend = $prevNewCustomers > 0 ? (($newCustomers - $prevNewCustomers) / $prevNewCustomers) * 100 : 0;
        $returningRateTrend = $prevReturningRate > 0 ? (($returningCustomerRate - $prevReturningRate) / $prevReturningRate) * 100 : 0;
        $avgOrdersTrend = $prevAvgOrdersPerCustomer > 0 ? (($avgOrdersPerCustomer - $prevAvgOrdersPerCustomer) / $prevAvgOrdersPerCustomer) * 100 : 0;

        // ===== CUSTOMER SEGMENTS OVER TIME =====

        $customerSegmentsOverTime = DB::table('orders')
            ->join('users', 'orders.user_id', '=', 'users.id')
            ->select(
                DB::raw('DATE(orders.created_at) as date'),
                DB::raw('COUNT(DISTINCT CASE WHEN users.created_at >= \'' . $start . '\' THEN users.id END) as new_customers'),
                DB::raw('COUNT(DISTINCT CASE WHEN users.created_at < \'' . $start . '\' THEN users.id END) as returning_customers')
            )
            ->whereBetween('orders.created_at', [$start, $end])
            ->where('orders.status', 'paid')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        \Log::info('Customer Segments Debug', [
            'count' => $customerSegmentsOverTime->count(),
            'data' => $customerSegmentsOverTime->take(5)
        ]);

        // ===== TOP CUSTOMERS WITH PAGINATION =====

        $topCustomersQuery = Order::select(
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
            ->groupBy('user_id', 'users.name', 'users.email');

        // Apply search filter
        if ($search) {
            $topCustomersQuery->where(function($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                  ->orWhere('users.email', 'like', "%{$search}%");
            });
        }

        // Apply status filter (active = ordered in last 30 days, inactive = no orders)
        if ($status === 'active') {
            $topCustomersQuery->having('last_order_date', '>=', Carbon::now()->subDays(30));
        } elseif ($status === 'inactive') {
            $topCustomersQuery->having('last_order_date', '<', Carbon::now()->subDays(30));
        }

        // Clone query for count
        $totalCount = $topCustomersQuery->get()->count();

        // Apply sorting
        $topCustomers = $topCustomersQuery
            ->orderBy($sortBy, $sortOrder)
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get()
            ->map(function($customer) {
                $daysSinceLastOrder = Carbon::parse($customer->last_order_date)->diffInDays(Carbon::now());

                return [
                    'id' => $customer->user_id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'total_orders' => $customer->total_orders,
                    'total_spent' => round($customer->total_spent, 2),
                    'avg_order_value' => round($customer->avg_order_value, 2),
                    'last_order_date' => Carbon::parse($customer->last_order_date)->format('Y-m-d H:i:s'),
                    'status' => $daysSinceLastOrder <= 30 ? 'active' : 'inactive',
                ];
            });

        // ===== ORDERS BY LOCATION =====

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
                'top_customers' => [
                    'data' => $topCustomers,
                    'total' => $totalCount,
                    'per_page' => $perPage,
                    'current_page' => $page,
                    'last_page' => ceil($totalCount / $perPage),
                    'from' => (($page - 1) * $perPage) + 1,
                    'to' => min($page * $perPage, $totalCount),
                ],
                'orders_by_location' => $ordersByLocation,
            ]
        ]);
    }

    /**
     * Get orders by location from customer_address
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

            // Try to extract city from address
            if (is_string($address)) {
                $addressData = json_decode($address, true);
                if ($addressData && isset($addressData['city'])) {
                    $city = $addressData['city'];
                } else {
                    // Basic extraction from plain string
                    $parts = explode(',', $address);
                    if (count($parts) >= 2) {
                        $city = trim($parts[count($parts) - 2]);
                    }
                }
            }

            if (!isset($locationStats[$city])) {
                $locationStats[$city] = [
                    'city' => $city,
                    'order_count' => 0,
                    'revenue' => 0,
                ];
            }

            $locationStats[$city]['order_count']++;
            $locationStats[$city]['revenue'] += $order->order_value;
        }

        // Sort by order count
        usort($locationStats, function($a, $b) {
            return $b['order_count'] <=> $a['order_count'];
        });

        // Return top 10 cities
        return collect(array_slice($locationStats, 0, 10));
    }
}
