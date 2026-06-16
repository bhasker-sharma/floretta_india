<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Slider;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::active()
            ->with(['variants', 'images'])
            ->get()
            ->map(fn($p) => $this->formatProduct($p));

        return response()->json($products);
    }

    public function show($slug)
    {
        $product = Product::active()
            ->with(['variants', 'images', 'reviews' => fn($q) => $q->approved()->with('user')])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($this->formatProduct($product, true));
    }

    public function homepage()
    {
        $product = Product::active()->with(['variants', 'images'])->first();
        $sliders = Slider::active()->where('page', 'home')->orderBy('sort_order')->get();

        return response()->json([
            'product' => $product ? $this->formatProduct($product) : null,
            'sliders' => $sliders,
        ]);
    }

    private function formatProduct(Product $p, bool $full = false): array
    {
        $data = [
            'id'             => $p->id,
            'name'           => $p->name,
            'slug'           => $p->slug,
            'tagline'        => $p->tagline,
            'description'    => $p->description ?? $p->description_short,
            'variants'       => $p->variants,
            'images'         => $p->images,
            'average_rating' => $p->average_rating,
            'review_count'   => $p->review_count,
        ];
        if ($full) {
            $data['ingredients']  = $p->ingredients;
            $data['how_to_use']   = $p->how_to_use;
            $data['reviews']          = $p->reviews->map(fn($r) => [
                'id'         => $r->id,
                'rating'     => $r->rating,
                'title'      => $r->title,
                'body'       => $r->body,
                'skin_type'  => $r->skin_type,
                'is_featured'=> $r->is_featured,
                'verified'   => $r->is_verified_purchase,
                'user_name'  => $r->user?->name,
                'created_at' => $r->created_at->toDateString(),
            ]);
        }
        return $data;
    }
}