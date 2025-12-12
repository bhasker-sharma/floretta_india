<?php

/**
 * Reviews Analytics Controller
 *
 * Handles product review analytics and moderation including:
 * - Review KPIs (total reviews, avg rating, 5-star %, low-star %)
 * - Rating distribution (1-5 stars breakdown)
 * - Reviews over time (daily trend)
 * - Top reviewed products
 * - Recent reviews with filtering and search
 */

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReviewsAnalyticsController extends Controller
{
    /**
     * Get review analytics data
     *
     * Returns comprehensive review metrics including KPIs with trends,
     * rating distribution, review trends, and paginated review list.
     *
     * @param Request $request - Contains filters, search, and date range
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Parse parameters
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

        // Calculate previous period for trends
        $daysDiff = $start->diffInDays($end);
        $prevStart = $start->copy()->subDays($daysDiff + 1);
        $prevEnd = $start->copy()->subDay();

        // ===== CURRENT PERIOD METRICS =====

        $currentReviews = ProductReview::whereBetween('created_at', [$start, $end])->get();
        $totalReviews = $currentReviews->count();
        $avgRating = $currentReviews->avg('rating') ?? 0;

        $fiveStarCount = $currentReviews->where('rating', 5)->count();
        $fiveStarPercent = $totalReviews > 0 ? ($fiveStarCount / $totalReviews) * 100 : 0;

        $lowStarCount = $currentReviews->whereIn('rating', [1, 2])->count();
        $lowStarPercent = $totalReviews > 0 ? ($lowStarCount / $totalReviews) * 100 : 0;

        // ===== PREVIOUS PERIOD METRICS =====

        $prevReviews = ProductReview::whereBetween('created_at', [$prevStart, $prevEnd])->get();
        $prevTotalReviews = $prevReviews->count();
        $prevAvgRating = $prevReviews->avg('rating') ?? 0;

        $prevFiveStarCount = $prevReviews->where('rating', 5)->count();
        $prevFiveStarPercent = $prevTotalReviews > 0 ? ($prevFiveStarCount / $prevTotalReviews) * 100 : 0;

        $prevLowStarCount = $prevReviews->whereIn('rating', [1, 2])->count();
        $prevLowStarPercent = $prevTotalReviews > 0 ? ($prevLowStarCount / $prevTotalReviews) * 100 : 0;

        // ===== CALCULATE TRENDS =====

        $reviewsTrend = $prevTotalReviews > 0 ? (($totalReviews - $prevTotalReviews) / $prevTotalReviews) * 100 : 0;
        $ratingTrend = $prevAvgRating > 0 ? (($avgRating - $prevAvgRating) / $prevAvgRating) * 100 : 0;
        $fiveStarTrend = $prevFiveStarPercent > 0 ? (($fiveStarPercent - $prevFiveStarPercent) / $prevFiveStarPercent) * 100 : 0;
        $lowStarTrend = $prevLowStarPercent > 0 ? (($lowStarPercent - $prevLowStarPercent) / $prevLowStarPercent) * 100 : 0;

        // ===== RATING DISTRIBUTION =====

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

        // ===== REVIEWS OVER TIME =====

        $reviewsOverTime = ProductReview::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as reviews'),
                DB::raw('AVG(rating) as avg_rating')
            )
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // ===== TOP REVIEWED PRODUCTS =====

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

        // ===== RECENT REVIEWS WITH FILTERS =====

        $reviewsQuery = ProductReview::with(['product:id,name', 'user:id,name,email'])
            ->whereBetween('created_at', [$start, $end]);

        // Apply search filter
        if ($search) {
            $reviewsQuery->where(function($q) use ($search) {
                $q->where('review', 'like', "%{$search}%")
                  ->orWhere('review_text', 'like', "%{$search}%")
                  ->orWhere('user_name', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($status) {
            $reviewsQuery->where('status', $status);
        }

        // Apply rating filter
        if ($rating) {
            $reviewsQuery->where('rating', $rating);
        }

        // Apply product filter
        if ($productId) {
            $reviewsQuery->where('product_id', $productId);
        }

        // Get reviews without pagination for now (will be array, not paginator)
        $recentReviews = $reviewsQuery
            ->orderBy($sortBy, $sortOrder)
            ->limit(100) // Limit for performance
            ->get()
            ->map(function($review) {
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
                'recent_reviews' => $recentReviews,
            ],
        ]);
    }
}
