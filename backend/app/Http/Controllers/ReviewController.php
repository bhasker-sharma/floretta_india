<?php

namespace App\Http\Controllers;

use App\Models\ProductReview;
use App\Models\productpage\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Get all reviews for a specific product
     */
    public function getProductReviews($productId)
    {
        try {
            $reviews = ProductReview::where('product_id', $productId)
                ->with('user:id,name')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'rating' => $review->rating,
                        'review' => $review->review,
                        'user_name' => $review->user_name ?? $review->user->name,
                        'created_at' => $review->created_at->format('d M Y'),
                        'user_id' => $review->user_id,
                        'verified_purchase' => $review->verified_purchase ?? false,
                    ];
                });

            // Calculate average rating
            $averageRating = $reviews->avg('rating') ?? 0;
            $totalReviews = $reviews->count();

            return response()->json([
                'success' => true,
                'reviews' => $reviews,
                'average_rating' => round($averageRating, 1),
                'total_reviews' => $totalReviews,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch reviews',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add a new review for a product
     */
    public function addReview(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'product_id' => 'required|exists:products,id',
                'rating' => 'required|integer|min:1|max:5',
                'review' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();

            // Check if user has purchased this product
            $verifiedPurchase = $this->hasUserPurchasedProduct($user->id, $request->product_id);

            // Check if user has already reviewed this product
            $existingReview = ProductReview::where('product_id', $request->product_id)
                ->where('user_id', $user->id)
                ->first();

            if ($existingReview) {
                // Update existing review
                $existingReview->update([
                    'rating' => $request->rating,
                    'review' => $request->review,
                    'user_name' => $user->name,
                    'verified_purchase' => $verifiedPurchase,
                ]);

                $review = $existingReview;
                $message = 'Review updated successfully';
            } else {
                // Create new review
                $review = ProductReview::create([
                    'product_id' => $request->product_id,
                    'user_id' => $user->id,
                    'rating' => $request->rating,
                    'review' => $request->review,
                    'user_name' => $user->name,
                    'verified_purchase' => $verifiedPurchase,
                ]);

                $message = 'Review added successfully';
            }

            // Update product rating and review count
            $this->updateProductRating($request->product_id);

            return response()->json([
                'success' => true,
                'message' => $message,
                'review' => [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'review' => $review->review,
                    'user_name' => $review->user_name,
                    'created_at' => $review->created_at->format('d M Y'),
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing review
     */
    public function updateReview(Request $request, $reviewId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'rating' => 'required|integer|min:1|max:5',
                'review' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();
            $review = ProductReview::find($reviewId);

            if (!$review) {
                return response()->json([
                    'success' => false,
                    'message' => 'Review not found'
                ], 404);
            }

            // Check if user owns this review
            if ($review->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to update this review'
                ], 403);
            }

            $review->update([
                'rating' => $request->rating,
                'review' => $request->review,
            ]);

            // Update product rating
            $this->updateProductRating($review->product_id);

            return response()->json([
                'success' => true,
                'message' => 'Review updated successfully',
                'review' => [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'review' => $review->review,
                    'user_name' => $review->user_name,
                    'created_at' => $review->created_at->format('d M Y'),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a review
     */
    public function deleteReview(Request $request, $reviewId)
    {
        try {
            $user = $request->user();
            $review = ProductReview::find($reviewId);

            if (!$review) {
                return response()->json([
                    'success' => false,
                    'message' => 'Review not found'
                ], 404);
            }

            // Check if user owns this review
            if ($review->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to delete this review'
                ], 403);
            }

            $productId = $review->product_id;
            $review->delete();

            // Update product rating
            $this->updateProductRating($productId);

            return response()->json([
                'success' => true,
                'message' => 'Review deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's review for a specific product
     */
    public function getUserReview(Request $request, $productId)
    {
        try {
            $user = $request->user();

            $review = ProductReview::where('product_id', $productId)
                ->where('user_id', $user->id)
                ->first();

            if (!$review) {
                return response()->json([
                    'success' => true,
                    'review' => null,
                ], 200);
            }

            return response()->json([
                'success' => true,
                'review' => [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'review' => $review->review,
                    'user_name' => $review->user_name,
                    'created_at' => $review->created_at->format('d M Y'),
                    'verified_purchase' => $review->verified_purchase ?? false,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if user has purchased a specific product
     */
    private function hasUserPurchasedProduct($userId, $productId)
    {
        // Check if user has any completed order containing this product
        $hasPurchased = Order::where('user_id', $userId)
            ->where('status', 'completed') // Only check completed orders
            ->get()
            ->filter(function($order) use ($productId) {
                // order_items is a JSON array of products
                $orderItems = $order->order_items;
                if (is_array($orderItems)) {
                    foreach ($orderItems as $item) {
                        // Check if this product ID exists in the order items
                        if (isset($item['id']) && $item['id'] == $productId) {
                            return true;
                        }
                        // Also check product_id field if it exists
                        if (isset($item['product_id']) && $item['product_id'] == $productId) {
                            return true;
                        }
                    }
                }
                return false;
            })
            ->isNotEmpty();

        return $hasPurchased;
    }

    /**
     * Update product's average rating and review count
     */
    private function updateProductRating($productId)
    {
        $stats = ProductReview::where('product_id', $productId)
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as review_count')
            ->first();

        $product = Product::find($productId);
        if ($product) {
            $product->update([
                'rating' => round($stats->avg_rating ?? 0, 1),
                'reviews_count' => $stats->review_count ?? 0,
            ]);
        }
    }

    /**
     * Admin: Get all reviews from all products
     */
    public function adminGetAllReviews(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 20);
            $search = $request->input('search', '');

            $query = ProductReview::with(['user:id,name,email', 'product:id,name,image'])
                ->orderBy('created_at', 'desc');

            // Search functionality
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('review', 'like', "%{$search}%")
                      ->orWhere('user_name', 'like', "%{$search}%")
                      ->orWhereHas('product', function($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
                });
            }

            $reviews = $query->paginate($perPage);

            $reviewsData = $reviews->map(function($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'review' => $review->review,
                    'user_name' => $review->user_name,
                    'user_email' => $review->user->email ?? 'N/A',
                    'product_id' => $review->product_id,
                    'product_name' => $review->product->name ?? 'Product Deleted',
                    'product_image' => $review->product->image ?? null,
                    'created_at' => $review->created_at->format('d M Y, h:i A'),
                    'updated_at' => $review->updated_at->format('d M Y, h:i A'),
                ];
            });

            return response()->json([
                'success' => true,
                'reviews' => $reviewsData,
                'pagination' => [
                    'total' => $reviews->total(),
                    'per_page' => $reviews->perPage(),
                    'current_page' => $reviews->currentPage(),
                    'last_page' => $reviews->lastPage(),
                    'from' => $reviews->firstItem(),
                    'to' => $reviews->lastItem(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch reviews',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Delete any review
     */
    public function adminDeleteReview($reviewId)
    {
        try {
            $review = ProductReview::find($reviewId);

            if (!$review) {
                return response()->json([
                    'success' => false,
                    'message' => 'Review not found'
                ], 404);
            }

            $productId = $review->product_id;
            $review->delete();

            // Update product rating
            $this->updateProductRating($productId);

            return response()->json([
                'success' => true,
                'message' => 'Review deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Get review statistics
     */
    public function adminGetReviewStats()
    {
        try {
            $totalReviews = ProductReview::count();
            $averageRating = ProductReview::avg('rating');

            $ratingDistribution = ProductReview::selectRaw('rating, COUNT(*) as count')
                ->groupBy('rating')
                ->orderBy('rating', 'desc')
                ->get()
                ->pluck('count', 'rating');

            $recentReviews = ProductReview::orderBy('created_at', 'desc')
                ->take(5)
                ->count();

            return response()->json([
                'success' => true,
                'stats' => [
                    'total_reviews' => $totalReviews,
                    'average_rating' => round($averageRating ?? 0, 2),
                    'rating_distribution' => $ratingDistribution,
                    'recent_reviews_count' => $recentReviews,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch review statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
