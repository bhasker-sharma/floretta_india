<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\productpage\FreshnerMist;
use App\Models\productpage\Product;

class CartController extends Controller
{
    /**
     * Store a new item in the cart with product snapshot.
     */
    public function store(Request $request)
    {
        $user = $request->user(); // get auth user

        $validated = $request->validate([
            'product_id' => 'required|integer',
            'quantity'   => 'required|integer|min:1',
            'type'       => 'required|in:freshner,face_mist,perfume',
        ]);

        $product = match ($validated['type']) {
            'perfume' => Product::find($validated['product_id']),
            default   => FreshnerMist::find($validated['product_id']),
        };

        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        $existingCartItem = Cart::where('user_id', $user->id)
            ->where('product_id', $validated['product_id'])
            ->where('flag', $validated['type'])
            ->first();

        if ($existingCartItem) {
            $existingCartItem->quantity += $validated['quantity'];
            $existingCartItem->save();

            return response()->json([
                'message' => 'Item quantity updated in cart.',
                'cart'    => $existingCartItem
            ]);
        }

        $cartData = array_merge($validated, [
            'user_id'            => $user->id,
            'name'               => $product->name,
            'scent'              => $product->scent ?? null,
            'volume_ml'          => $product->volume_ml ?? null,
            'price'              => $product->price,
            'original_price'     => $product->original_price ?? null,
            'discount_amount'    => $product->discount_amount ?? null,
            'is_discount_active' => $product->is_discount_active ?? false,
            'delivery_charge'    => $product->delivery_charge ?? 0,
            'available_quantity' => $product->available_quantity ?? 0,
            'rating'             => $product->rating ?? null,
            'reviews_count'      => $product->reviews_count ?? 0,
            'image_path'         => $product->image ?? $product->image_path ?? null,
            'flag'               => $product->flag ?? $validated['type'],
            'discription'        => $product->discription ?? null,
            'about_product'      => $product->about_product ?? null,
            'extra_images'       => is_array($product->extra_images) ? json_encode($product->extra_images) : $product->extra_images,
            'ingridiance'        => is_array($product->ingridiance ?? $product->ingredients ?? null)
                                     ? json_encode($product->ingridiance ?? $product->ingredients)
                                     : ($product->ingridiance ?? $product->ingredients ?? null),
            'profit'             => $product->profit ?? null,
            'colour'             => $product->colour ?? null,
            'brand'              => $product->brand ?? null,
            'item_form'          => $product->item_form ?? null,
            'power_source'       => $product->power_source ?? null,
            'about'              => $product->about ?? null,
        ]);

        $cartItem = Cart::create($cartData);

        return response()->json([
            'message' => 'Item added to cart successfully.',
            'cart'    => $cartItem
        ], 201);
    }

    /**
     * Get current user's cart items.
     */
    public function index(Request $request)
    {
        $cartItems = Cart::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json(['cart' => $cartItems]);
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(Request $request, $id)
    {
        $cartItem = Cart::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found.'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart successfully.']);
    }

    /**
     * Update item quantity in the cart.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = Cart::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found.'], 404);
        }

        $cartItem->quantity = $validated['quantity'];
        $cartItem->save();

        return response()->json([
            'message' => 'Cart item quantity updated.',
            'cart'    => $cartItem
        ]);
    }
}
