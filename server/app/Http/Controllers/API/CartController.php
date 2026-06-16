<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    private function getCart(Request $r)
    {
        if (auth()->check()) {
            return Cart::where('user_id', auth()->id())->with(['product.images', 'variant'])->get();
        }
        return Cart::where('session_id', $r->header('X-Session-Id'))
            ->with(['product.images', 'variant'])->get();
    }

    public function index(Request $r)
    {
        return response()->json($this->getCart($r));
    }

    public function store(Request $r)
    {
        $v = Validator::make($r->all(), [
            'variant_id' => 'required|exists:product_variants,id',
            'qty'        => 'integer|min:1|max:10',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $variant = ProductVariant::findOrFail($r->variant_id);
        $r->merge(['product_id' => $variant->product_id]);
        $where   = auth()->check()
            ? ['user_id' => auth()->id(), 'variant_id' => $r->variant_id]
            : ['session_id' => $r->header('X-Session-Id'), 'variant_id' => $r->variant_id];

        $item = Cart::where($where)->first();
        if ($item) {
            $item->increment('qty', $r->input('qty', 1));
        } else {
            Cart::create(array_merge($where, [
                'product_id'   => $r->product_id,
                'variant_id'   => $r->variant_id,
                'qty'          => $r->input('qty', 1),
                'price_at_add' => $variant->price,
            ]));
        }

        return response()->json($this->getCart($r));
    }

    public function update(Request $r, $id)
    {
        $item = Cart::findOrFail($id);
        $qty  = $r->input('qty', 1);
        if ($qty <= 0) {
            $item->delete();
        } else {
            $item->update(['qty' => $qty]);
        }
        return response()->json($this->getCart($r));
    }

    public function destroy(Request $r, $id)
    {
        Cart::findOrFail($id)->delete();
        return response()->json($this->getCart($r));
    }

    public function clear(Request $r)
    {
        if (auth()->check()) {
            Cart::where('user_id', auth()->id())->delete();
        } else {
            Cart::where('session_id', $r->header('X-Session-Id'))->delete();
        }
        return response()->json([]);
    }

    public function merge(Request $r)
    {
        $sessionId = $r->input('session_id') ?? $r->header('X-Session-Id');
        if (!$sessionId) return response()->json(['message' => 'No session id.'], 400);

        $guestItems = Cart::where('session_id', $sessionId)->get();
        foreach ($guestItems as $item) {
            $existing = Cart::where('user_id', auth()->id())
                ->where('variant_id', $item->variant_id)->first();
            if ($existing) {
                $existing->increment('qty', $item->qty);
                $item->delete();
            } else {
                $item->update(['user_id' => auth()->id(), 'session_id' => null]);
            }
        }
        return response()->json(Cart::where('user_id', auth()->id())->with(['product.images','variant'])->get());
    }
}