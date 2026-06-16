<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with(['variants','images'])->get());
    }

    public function store(Request $r)
    {
        $product = Product::create(array_merge($r->only([
            'name','description_short','description_long','ingredients','how_to_use','sku'
        ]), ['slug' => Str::slug($r->name), 'is_active' => true]));

        if ($r->has('variants')) {
            foreach ($r->variants as $i => $v) {
                $product->variants()->create(array_merge($v, ['sort_order' => $i]));
            }
        }
        return response()->json($product->load(['variants','images']), 201);
    }

    public function update(Request $r, $id)
    {
        $product = Product::findOrFail($id);
        $data    = $r->only(['name','description_short','description_long','ingredients','how_to_use','sku','is_active']);
        if ($r->has('name')) $data['slug'] = Str::slug($r->name);
        $product->update($data);

        if ($r->has('variants')) {
            foreach ($r->variants as $v) {
                if (!empty($v['id'])) {
                    $product->variants()->find($v['id'])?->update($v);
                } else {
                    $product->variants()->create($v);
                }
            }
        }
        return response()->json($product->fresh()->load(['variants','images']));
    }

    public function uploadImages(Request $r, $id)
    {
        $product = Product::findOrFail($id);
        $paths   = [];
        foreach ($r->file('images', []) as $i => $file) {
            $path = $file->store('products', 'public');
            $img  = ProductImage::create([
                'product_id' => $product->id,
                'url'        => '/storage/'.$path,
                'is_primary' => $i === 0 && $product->images()->count() === 0,
                'sort_order' => $product->images()->count() + $i,
            ]);
            $paths[] = $img;
        }
        return response()->json($paths, 201);
    }

    public function deleteImage($id, $imgId)
    {
        ProductImage::where('id', $imgId)->where('product_id', $id)->delete();
        return response()->json(['message' => 'Image deleted.']);
    }
}