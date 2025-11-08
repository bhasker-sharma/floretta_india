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

        // Load images relationship
        $products = $query->with('images')->orderBy('name')->get();

        return response()->json($products);
    }

    // Get single product by ID (perfume only)
    public function show($id)
    {
        $product = Product::where('id', $id)
                         ->where('flag', 'perfume')
                         ->with('images')
                         ->first();

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
            // Load products with their images
            $products = Product::with('images')->orderBy('created_at', 'desc')->get();

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
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10MB max per image
            'ingredients' => 'nullable|string',
            'brand' => 'nullable|string',
            'colour' => 'nullable|string',
            'item_form' => 'nullable|string',
            'power_source' => 'nullable|string',
            'launch_date' => 'nullable|date',
        ]);

        try {
            // Handle image uploads
            $imagePath = '';
            $uploadedImages = [];
            
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    // Generate unique filename
                    $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    
                    // Store in public/storage/images directory (to match URL structure)
                    $image->move(public_path('storage/images'), $filename);
                    
                    $uploadedImages[] = [
                        'path' => 'images/' . $filename,
                        'sort_order' => $index,
                        'is_primary' => $index === 0 // First image is primary
                    ];
                }
                
                // Use first image as primary image (for backward compatibility)
                $imagePath = $uploadedImages[0]['path'] ?? '';
            } elseif (!empty($validated['image'])) {
                // Use provided image path (legacy support)
                $imagePath = $validated['image'];
            }

            // Set image path or empty string
            $validated['image'] = $imagePath ?: '';

            // Map Discription to discription (database uses lowercase)
            if (isset($validated['Discription'])) {
                $validated['discription'] = $validated['Discription'];
                unset($validated['Discription']);
            } else {
                $validated['discription'] = '';
            }

            // Remove images array from validated data (we already processed it)
            unset($validated['images']);

            // Set default values for fields that don't have database defaults
            $validated['rating'] = $validated['rating'] ?? 0;
            $validated['reviews_count'] = $validated['reviews_count'] ?? 0;
            $validated['reviews'] = $validated['reviews'] ?? 0;

            // Create the product
            $product = Product::create($validated);

            // Save all uploaded images to product_images table
            if (!empty($uploadedImages)) {
                foreach ($uploadedImages as $imageData) {
                    $product->images()->create([
                        'image_path' => $imageData['path'],
                        'sort_order' => $imageData['sort_order'],
                        'is_primary' => $imageData['is_primary']
                    ]);
                }
            }

            // Load images relationship for response
            $product->load('images');

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

    // Admin: Update existing product
    public function adminUpdateProduct(Request $request, $id)
    {
        // Verify admin authentication
        $currentAdmin = auth('admin')->user();

        if (!$currentAdmin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized'
            ], 401);
        }

        // Find the product
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'error' => 'Product not found'
            ], 404);
        }

        // Validate request
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'flag' => 'sometimes|required|in:perfume,freshner,face_mist',
            'price' => 'sometimes|required|numeric|min:0',
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
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'existing_images_order' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'brand' => 'nullable|string',
            'colour' => 'nullable|string',
            'item_form' => 'nullable|string',
            'power_source' => 'nullable|string',
            'launch_date' => 'nullable|date',
        ]);

        try {
            // Handle existing images reordering
            if ($request->has('existing_images_order')) {
                $existingImagesOrder = json_decode($request->input('existing_images_order'), true);
                
                if (is_array($existingImagesOrder)) {
                    foreach ($existingImagesOrder as $imageData) {
                        $productImage = $product->images()->find($imageData['id']);
                        if ($productImage) {
                            $productImage->update([
                                'sort_order' => $imageData['sort_order'],
                                'is_primary' => $imageData['is_primary']
                            ]);
                        }
                    }
                    
                    // Update the main product image to the first one in order
                    if (!empty($existingImagesOrder)) {
                        $firstImage = $product->images()->find($existingImagesOrder[0]['id']);
                        if ($firstImage) {
                            $validated['image'] = $firstImage->image_path;
                        }
                    }
                }
            }
            
            // Handle image uploads if new images provided
            $uploadedImages = [];
            
            // Handle image uploads if new images provided
            $uploadedImages = [];
            
            if ($request->hasFile('images')) {
                // Get the count of existing images to continue sort_order
                $existingImagesCount = $product->images()->count();
                
                foreach ($request->file('images') as $index => $image) {
                    // Generate unique filename
                    $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    
                    // Store in public/storage/images directory
                    $image->move(public_path('storage/images'), $filename);
                    
                    $uploadedImages[] = [
                        'path' => 'images/' . $filename,
                        'sort_order' => $existingImagesCount + $index,
                        'is_primary' => false // New images are never primary unless they're the only ones
                    ];
                }
                
                // Update primary image only if this is the first image ever
                if (!empty($uploadedImages) && $existingImagesCount === 0) {
                    $validated['image'] = $uploadedImages[0]['path'];
                    $uploadedImages[0]['is_primary'] = true;
                }
            }

            // Map Discription to discription
            if (isset($validated['Discription'])) {
                $validated['discription'] = $validated['Discription'];
                unset($validated['Discription']);
            }

            // Remove images array from validated data
            unset($validated['images']);

            // Update the product
            $product->update($validated);

            // Add new images to product_images table if provided
            if (!empty($uploadedImages)) {
                // Optional: You can choose to delete old images or keep them
                // $product->images()->delete(); // Uncomment to replace all images
                
                foreach ($uploadedImages as $imageData) {
                    $product->images()->create([
                        'image_path' => $imageData['path'],
                        'sort_order' => $imageData['sort_order'],
                        'is_primary' => $imageData['is_primary']
                    ]);
                }
            }

            // Load images relationship for response
            $product->load('images');

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'product' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to update product',
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
