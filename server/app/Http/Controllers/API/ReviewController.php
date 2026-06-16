<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function index($slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        $reviews = ProductReview::approved()
            ->where('product_id', $product->id)
            ->with('user')
            ->orderByDesc('created_at')
            ->paginate(10);

        $breakdown = ProductReview::approved()->where('product_id', $product->id)
            ->selectRaw('rating, count(*) as count')
            ->groupBy('rating')->pluck('count', 'rating');

        return response()->json(['reviews' => $reviews, 'breakdown' => $breakdown]);
    }

    public function store(Request $r, $slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        $v = Validator::make($r->all(), [
            'rating'    => 'required|integer|min:1|max:5',
            'title'     => 'nullable|string|max:100',
            'body'      => 'required|string',
            'skin_type' => 'nullable|string|max:50',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $exists = ProductReview::where('product_id', $product->id)->where('user_id', auth()->id())->exists();
        if ($exists) return response()->json(['message' => 'You have already reviewed this product.'], 409);

        $review = ProductReview::create([
            'product_id' => $product->id,
            'user_id'    => auth()->id(),
            'rating'     => $r->rating,
            'title'      => $r->title,
            'body'       => $r->body,
            'skin_type'  => $r->skin_type,
            'status'     => 'pending',
        ]);

        return response()->json($review, 201);
    }

    public function update(Request $r, $id)
    {
        $review = ProductReview::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $review->update($r->only(['rating','title','body','skin_type']));
        return response()->json($review->fresh());
    }

    public function destroy($id)
    {
        ProductReview::where('id', $id)->where('user_id', auth()->id())->delete();
        return response()->json(['message' => 'Review deleted.']);
    }

    public function myReview($slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        $review  = ProductReview::where('product_id', $product->id)->where('user_id', auth()->id())->first();
        return response()->json($review);
    }
}