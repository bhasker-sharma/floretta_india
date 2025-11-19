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

    // Get single product by ID (all types)
    public function show($id)
    {
        $product = Product::where('id', $id)
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

        // Get freshners and mists from products table with images
        $products = Product::whereIn('flag', ['freshner', 'face_mist'])
            ->with('images')
            ->get();

        // Merge both collections
        $all = $freshnerMists->merge($products);

        return response()->json($all);
    }

    // Get single freshner/mist by ID
    public function showFreshner($id)
    {
        // Try to find in freshner_mists table first
        $freshner = FreshnerMist::find($id);

        // If not found, try products table with images relationship
        if (!$freshner) {
            $freshner = Product::where('id', $id)
                ->whereIn('flag', ['freshner', 'face_mist'])
                ->with('images')
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
            // Load products with their images from main products table
            $products = Product::with('images')->orderBy('created_at', 'desc')->get();

            // Load products from old freshner_mist table
            $freshnerMists = FreshnerMist::orderBy('created_at', 'desc')->get();

            // Transform freshner_mist items to match products structure
            $transformedFreshnerMists = $freshnerMists->map(function($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'flag' => $item->flag,
                    'price' => $item->price,
                    'original_price' => $item->original_price,
                    'discount_amount' => $item->discount_amount,
                    'is_discount_active' => $item->is_discount_active,
                    'delivery_charge' => $item->delivery_charge,
                    'available_quantity' => $item->available_quantity,
                    'volume_ml' => $item->volume_ml,
                    'scent' => $item->scent,
                    'rating' => $item->rating,
                    'reviews_count' => $item->reviews_count,
                    'image' => $item->image_path,
                    'image_path' => $item->image_path,
                    'all_images' => $item->image_path ? [[
                        'id' => 'legacy',
                        'path' => $item->image_path,
                        'url' => url('storage/' . $item->image_path),
                        'sort_order' => 0,
                        'is_primary' => true
                    ]] : [],
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                    'source_table' => 'freshner_mist', // Flag to identify source
                ];
            });

            // Merge both collections
            $allProducts = $products->concat($transformedFreshnerMists)
                ->sortByDesc('created_at')
                ->values();

            return response()->json([
                'success' => true,
                'products' => $allProducts
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
                // Create product-specific folder
                $productFolderName = $this->sanitizeProductName($validated['name']);
                $productFolderPath = public_path('storage/images/uproducts/' . $productFolderName);

                // Create directory if it doesn't exist
                if (!is_dir($productFolderPath)) {
                    mkdir($productFolderPath, 0755, true);
                }

                foreach ($request->file('images') as $index => $image) {
                    // Generate unique filename
                    $filename = 'img' . ($index + 1) . '_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

                    // Store in product-specific folder
                    $image->move($productFolderPath, $filename);

                    $uploadedImages[] = [
                        'path' => 'images/uproducts/' . $productFolderName . '/' . $filename,
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

    // Admin: Update existing product (handles both tables)
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

        // Check if it's a legacy product (from freshner_mist table)
        $isLegacy = $request->input('source_table') === 'freshner_mist';

        if ($isLegacy) {
            return $this->adminUpdateLegacyProduct($request, $id);
        }

        // Find the product in main products table
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
            'is_bestseller' => 'nullable|boolean',
            'bestseller_order' => 'nullable|integer|min:0',
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

            if ($request->hasFile('images')) {
                // Create product-specific folder based on current/updated product name
                $productName = $validated['name'] ?? $product->name;
                $productFolderName = $this->sanitizeProductName($productName);
                $productFolderPath = public_path('storage/images/uproducts/' . $productFolderName);

                // Create directory if it doesn't exist
                if (!is_dir($productFolderPath)) {
                    mkdir($productFolderPath, 0755, true);
                }

                // Get the count of existing images to continue sort_order
                $existingImagesCount = $product->images()->count();

                foreach ($request->file('images') as $index => $image) {
                    // Generate unique filename
                    $imageNumber = $existingImagesCount + $index + 1;
                    $filename = 'img' . $imageNumber . '_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

                    // Store in product-specific folder
                    $image->move($productFolderPath, $filename);

                    $uploadedImages[] = [
                        'path' => 'images/uproducts/' . $productFolderName . '/' . $filename,
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

    // Admin: Update legacy product (freshner_mist table)
    private function adminUpdateLegacyProduct(Request $request, $id)
    {
        $freshnerMist = FreshnerMist::find($id);

        if (!$freshnerMist) {
            return response()->json([
                'success' => false,
                'error' => 'Legacy product not found'
            ], 404);
        }

        // Validate request
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'flag' => 'sometimes|required|in:perfume,freshner,face_mist',
            'price' => 'sometimes|required|numeric|min:0',
            'volume_ml' => 'nullable|string',
            'scent' => 'nullable|string',
            'original_price' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'is_discount_active' => 'nullable|boolean',
            'delivery_charge' => 'nullable|numeric|min:0',
            'available_quantity' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        try {
            // Handle single image upload for legacy products
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($freshnerMist->image_path) {
                    $oldImagePath = public_path('storage/' . $freshnerMist->image_path);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }

                // Upload new image to legacy location
                $image = $request->file('image');
                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('storage/images/freshner'), $filename);
                $validated['image_path'] = 'images/freshner/' . $filename;
            }

            // Update the legacy product
            $freshnerMist->update($validated);

            // Transform for response to match products structure
            $response = [
                'id' => $freshnerMist->id,
                'name' => $freshnerMist->name,
                'flag' => $freshnerMist->flag,
                'price' => $freshnerMist->price,
                'original_price' => $freshnerMist->original_price,
                'discount_amount' => $freshnerMist->discount_amount,
                'is_discount_active' => $freshnerMist->is_discount_active,
                'delivery_charge' => $freshnerMist->delivery_charge,
                'available_quantity' => $freshnerMist->available_quantity,
                'volume_ml' => $freshnerMist->volume_ml,
                'scent' => $freshnerMist->scent,
                'rating' => $freshnerMist->rating,
                'reviews_count' => $freshnerMist->reviews_count,
                'image' => $freshnerMist->image_path,
                'image_path' => $freshnerMist->image_path,
                'all_images' => $freshnerMist->image_path ? [[
                    'id' => 'legacy',
                    'path' => $freshnerMist->image_path,
                    'url' => url('storage/' . $freshnerMist->image_path),
                    'sort_order' => 0,
                    'is_primary' => true
                ]] : [],
                'created_at' => $freshnerMist->created_at,
                'updated_at' => $freshnerMist->updated_at,
                'source_table' => 'freshner_mist',
            ];

            return response()->json([
                'success' => true,
                'message' => 'Legacy product updated successfully',
                'product' => $response
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to update legacy product',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Admin: Delete product (handles both tables)
    public function adminDeleteProduct($id, Request $request)
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
            // Check if source_table is provided as query parameter
            $sourceTable = $request->query('source_table');

            // If source_table is explicitly set to 'freshner_mist', delete from legacy table
            if ($sourceTable === 'freshner_mist') {
                $freshnerMist = FreshnerMist::find($id);

                if ($freshnerMist) {
                    // Delete image file if exists
                    if ($freshnerMist->image_path) {
                        $imagePath = public_path('storage/' . $freshnerMist->image_path);
                        if (file_exists($imagePath)) {
                            unlink($imagePath);
                        }
                    }

                    $freshnerMist->delete();

                    return response()->json([
                        'success' => true,
                        'message' => 'Legacy product deleted successfully'
                    ]);
                }

                return response()->json([
                    'success' => false,
                    'error' => 'Legacy product not found'
                ], 404);
            }

            // Otherwise, check the main products table first
            $product = Product::find($id);

            if ($product) {
                // Delete product folder if it exists
                $folderPath = public_path('storage/images/uproducts/' . $this->sanitizeProductName($product->name));
                if (is_dir($folderPath)) {
                    $this->deleteDirectory($folderPath);
                }

                $product->delete();

                return response()->json([
                    'success' => true,
                    'message' => 'Product deleted successfully'
                ]);
            }

            // Fallback: If not found in products table and no source_table specified, check legacy table
            $freshnerMist = FreshnerMist::find($id);

            if ($freshnerMist) {
                // Delete image file if exists
                if ($freshnerMist->image_path) {
                    $imagePath = public_path('storage/' . $freshnerMist->image_path);
                    if (file_exists($imagePath)) {
                        unlink($imagePath);
                    }
                }

                $freshnerMist->delete();

                return response()->json([
                    'success' => true,
                    'message' => 'Product deleted successfully'
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => 'Product not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete product',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Admin: Delete individual product image
    public function adminDeleteProductImage($productId, $imageId)
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
            $product = Product::find($productId);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'error' => 'Product not found'
                ], 404);
            }

            $productImage = $product->images()->find($imageId);

            if (!$productImage) {
                return response()->json([
                    'success' => false,
                    'error' => 'Image not found'
                ], 404);
            }

            // Delete physical file
            $imagePath = public_path('storage/' . $productImage->image_path);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }

            // Delete from database
            $productImage->delete();

            // If this was the primary image, set another image as primary
            if ($productImage->is_primary) {
                $firstImage = $product->images()->orderBy('sort_order')->first();
                if ($firstImage) {
                    $firstImage->update(['is_primary' => true]);
                    $product->update(['image' => $firstImage->image_path]);
                } else {
                    // No images left, clear the main image field
                    $product->update(['image' => '']);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete image',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Helper: Sanitize product name for folder creation
    private function sanitizeProductName($name)
    {
        // Convert to lowercase, replace spaces with hyphens, remove special characters
        $sanitized = strtolower($name);
        $sanitized = preg_replace('/[^a-z0-9\s-]/', '', $sanitized);
        $sanitized = preg_replace('/[\s-]+/', '-', $sanitized);
        $sanitized = trim($sanitized, '-');
        return $sanitized ?: 'product';
    }

    // Helper: Delete directory recursively
    private function deleteDirectory($dir)
    {
        if (!is_dir($dir)) {
            return false;
        }

        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            $path = $dir . DIRECTORY_SEPARATOR . $file;
            is_dir($path) ? $this->deleteDirectory($path) : unlink($path);
        }

        return rmdir($dir);
    }

    /**
     * Reorder bestseller products
     */
    public function reorderBestsellers(Request $request)
    {
        // Verify admin authentication
        $currentAdmin = auth('admin')->user();

        if (!$currentAdmin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized'
            ], 401);
        }

        $validated = $request->validate([
            'bestsellers' => 'required|array',
            'bestsellers.*.id' => 'required|integer|exists:products,id',
            'bestsellers.*.order' => 'required|integer|min:0',
        ]);

        try {
            foreach ($validated['bestsellers'] as $item) {
                Product::where('id', $item['id'])->update([
                    'bestseller_order' => $item['order'],
                    'is_bestseller' => true, // Ensure it's marked as bestseller
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Bestseller order updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to update bestseller order',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
