<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index()
    {
        return response()->json(
            Wishlist::where('user_id', auth()->id())->with(['product.images','variant'])->get()
        );
    }

    public function store(Request $r)
    {
        $item = Wishlist::firstOrCreate([
            'user_id'    => auth()->id(),
            'product_id' => $r->product_id,
            'variant_id' => $r->variant_id,
        ]);
        return response()->json($item, 201);
    }

    public function destroy($id)
    {
        Wishlist::where('id', $id)->where('user_id', auth()->id())->delete();
        return response()->json(['message' => 'Removed from wishlist.']);
    }
}