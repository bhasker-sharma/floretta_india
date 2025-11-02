<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\productpage\Product;
use App\Models\productpage\FreshnerMist;

class ProductController extends Controller
{
    // List all perfumes (optionally filter by note)
    public function index(Request $request)
    {
        $note = strtolower($request->query('note', 'all'));
        $query = Product::query();

        if ($note !== 'all') {
            $query->where('note', $note);
        }

        // Only fetch perfumes
        $query->where('flag', 'perfume');

        $products = $query->orderBy('name')->get();

        return response()->json($products);
    }

    // Get single product by ID (perfume only)
    public function show($id)
    {
        $product = Product::where('id', $id)->where('flag', 'perfume')->first();

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        return response()->json($product);
    }

    // List all freshners and mists (both combined)
    public function allFreshnerAndMist()
    {
        // Get freshners and mists from freshner_mists table
        $freshnerMists = FreshnerMist::whereIn('flag', ['freshner', 'face_mist'])->get();

        // Get freshners and mists from products table
        $products = Product::whereIn('flag', ['freshner', 'face_mist'])->get();

        // Merge both collections
        $all = $freshnerMists->merge($products);

        return response()->json($all);
    }

    // Get single freshner/mist by ID
    public function showFreshner($id)
    {
        // Try to find in freshner_mists table first
        $freshner = FreshnerMist::find($id);

        // If not found, try products table
        if (!$freshner) {
            $freshner = Product::where('id', $id)
                ->whereIn('flag', ['freshner', 'face_mist'])
                ->first();
        }

        if (!$freshner) {
            return response()->json(['error' => 'Freshner/Mist not found'], 404);
        }

        return response()->json($freshner);
    }

    // List all perfumes
    public function allPerfumes()
    {
        $perfumes = Product::where('flag', 'perfume')->get();
        return response()->json($perfumes);
    }

    // Admin: Get all products (all flags)
    public function adminGetAllProducts()
    {
        // Verify admin authentication
        $currentAdmin = auth('admin')->user();

        if (!$currentAdmin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized'
            ], 401);
        }

        try {
            $products = Product::orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'products' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch products',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Admin: Create new product
    public function adminCreateProduct(Request $request)
    {
        // Verify admin authentication
        $currentAdmin = auth('admin')->user();

        if (!$currentAdmin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized'
            ], 401);
        }

        // Validate request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'flag' => 'required|in:perfume,freshner,face_mist',
            'price' => 'required|numeric|min:0',
            'volume_ml' => 'nullable|string',
            'scent' => 'nullable|string',
            'note' => 'nullable|string',
            'Discription' => 'nullable|string',
            'about_product' => 'nullable|string',
            'original_price' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'is_discount_active' => 'nullable|boolean',
            'delivery_charge' => 'nullable|numeric|min:0',
            'available_quantity' => 'nullable|integer|min:0',
            'image' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'brand' => 'nullable|string',
            'colour' => 'nullable|string',
            'item_form' => 'nullable|string',
            'power_source' => 'nullable|string',
            'launch_date' => 'nullable|date',
        ]);

        try {
            // Map Discription to discription (database uses lowercase)
            if (isset($validated['Discription'])) {
                $validated['discription'] = $validated['Discription'];
                unset($validated['Discription']);
            } else {
                $validated['discription'] = '';
            }

            // Set default values for fields that don't have database defaults
            $validated['rating'] = $validated['rating'] ?? 0;
            $validated['reviews_count'] = $validated['reviews_count'] ?? 0;
            $validated['reviews'] = $validated['reviews'] ?? 0;

            $product = Product::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'product' => $product
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to create product',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Admin: Delete product
    public function adminDeleteProduct($id)
    {
        // Verify admin authentication
        $currentAdmin = auth('admin')->user();

        if (!$currentAdmin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized'
            ], 401);
        }

        try {
            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'error' => 'Product not found'
                ], 404);
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete product',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
