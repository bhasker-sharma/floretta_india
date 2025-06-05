<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\productpage\Product;
use App\Models\productpage\FreshnerMist;

class ProductController extends Controller
{
    // List all products (optionally filter by note)
    public function index(Request $request)
    {
        $note = strtolower($request->query('note', 'all'));
        $query = Product::query();

        if ($note !== 'all') {
            $query->where('note', $note);
        }

        $products = $query->orderBy('name')->get();

        return response()->json($products);
    }

    // Get single product by ID
    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        return response()->json($product);
    }

    // List all freshners and mists (both combined)
    public function allFreshnerAndMist()
    {
        $all = FreshnerMist::whereIn('flag', ['freshner', 'face_mist'])->get();

        return response()->json($all);
    }

    // Get single freshner/mist by ID
    public function showFreshner($id)
    {
        $freshner = FreshnerMist::find($id);

        if (!$freshner) {
            return response()->json(['error' => 'Freshner/Mist not found'], 404);
        }

        return response()->json($freshner);
    }
}
