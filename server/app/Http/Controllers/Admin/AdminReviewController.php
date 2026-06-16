<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;

class AdminReviewController extends Controller
{
    public function index(Request $r)
    {
        $q = ProductReview::with(['user','product'])->orderByDesc('created_at');
        if ($r->status) $q->where('status', $r->status);
        return response()->json($q->paginate(20));
    }

    public function updateStatus(Request $r, $id)
    {
        $review = ProductReview::findOrFail($id);
        $review->update(['status' => $r->status]);
        return response()->json($review->fresh());
    }

    public function toggleFeatured($id)
    {
        $review = ProductReview::findOrFail($id);
        $review->update(['is_featured' => !$review->is_featured]);
        return response()->json($review->fresh());
    }

    public function destroy($id)
    {
        ProductReview::findOrFail($id)->delete();
        return response()->json(['message' => 'Review deleted.']);
    }
}