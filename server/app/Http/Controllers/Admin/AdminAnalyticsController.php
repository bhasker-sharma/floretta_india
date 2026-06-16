<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\ProductReview;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    public function overview()
    {
        return response()->json([
            'total_orders'   => Order::count(),
            'total_revenue'  => Order::where('payment_status','paid')->sum('total'),
            'total_users'    => User::count(),
            'pending_orders' => Order::where('status','pending')->count(),
            'new_users_today'=> User::whereDate('created_at', today())->count(),
            'orders_today'   => Order::whereDate('created_at', today())->count(),
        ]);
    }

    public function sales()
    {
        $data = Order::where('payment_status','paid')
            ->whereDate('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($data);
    }

    public function products()
    {
        $data = DB::table('orders')
            ->where('payment_status','paid')
            ->selectRaw('JSON_UNQUOTE(JSON_EXTRACT(items, "$[*].product_name")) as name, SUM(total) as revenue')
            ->groupBy('name')
            ->get();

        return response()->json([
            'total_reviews'   => ProductReview::count(),
            'approved_reviews'=> ProductReview::where('status','approved')->count(),
            'average_rating'  => round(ProductReview::approved()->avg('rating') ?? 0, 1),
        ]);
    }
}