<?php
namespace App\Http\Controllers;

use App\Models\Homepage\Coco;
use App\Models\Homepage\Slider;
use App\Models\Homepage\Image;
use App\Models\Homepage\Uproduct;
use App\Models\Homepage\Testimonial;
use App\Models\productpage\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;

class HomeController extends Controller
{
   public function index(Request $request)
{
    // $hproducts = Homeproduct::all();
    $sliders = Slider::where('id', '<=', 5)->get(); // ✅ only first 5 IDs
    $images = Image::all();
    $coco = Coco::find(1);
    $uproducts = Uproduct::all();

    // Get old testimonials (keeping for backward compatibility)
    $testimonials = Testimonial::all();

    // Get user reviews with product details for the customer section
    // ONLY show featured reviews on homepage
    $reviews = ProductReview::with(['product:id,name', 'user:id,name'])
        ->where('is_featured', true) // Only featured reviews
        ->orderBy('created_at', 'desc')
        ->limit(12) // Get top 12 featured reviews
        ->get()
        ->map(function ($review) {
            return [
                'id' => $review->id,
                'name' => $review->user_name ?? $review->user->name ?? 'Anonymous',
                'rating' => $review->rating,
                'product' => $review->product->name ?? 'Product',
                'review' => $review->review_text,
                'verified_purchase' => $review->verified_purchase,
                'is_featured' => $review->is_featured,
                'created_at' => $review->created_at->format('M d, Y'),
            ];
        });

    // Get bestseller products ordered by bestseller_order
    $bestsellers = Product::where('is_bestseller', true)
        ->with('images')
        ->orderBy('bestseller_order', 'asc')
        ->orderBy('created_at', 'desc')
        ->limit(10)
        ->get();

    return response()->json([
        // 'homeproducts' => $hproducts,
        'sliders' => $sliders,
        'images' => $images,
        'coco' => $coco,
        'uproducts' => $uproducts,
        'testimonials' => $testimonials, // Keep old testimonials for backward compatibility
        'reviews' => $reviews, // Add new reviews from actual customers
        'bestsellers' => $bestsellers,
    ]);
}

}
