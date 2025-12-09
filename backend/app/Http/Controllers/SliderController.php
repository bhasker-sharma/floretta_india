<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Slider;

class SliderController extends Controller
{
    /**
     * Get all sliders for a specific page
     */
    public function getSlidersByPage($page)
    {
        $validPages = ['home', 'products', 'liveperfume', 'hotelamenities'];

        if (!in_array($page, $validPages)) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid page'
            ], 400);
        }

        try {
            $sliders = Slider::where('page', $page)
                ->orderBy('order', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'sliders' => $sliders->map(function($slider) {
                    return [
                        'id' => $slider->id,
                        'page' => $slider->page,
                        'image_url' => $slider->image ? '/api/storage/' . $slider->image : null,
                        'order' => $slider->order,
                        'created_at' => $slider->created_at,
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch sliders',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all sliders (for admin)
     */
    public function adminGetAllSliders()
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
            $sliders = Slider::orderBy('page', 'asc')
                ->orderBy('order', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'sliders' => $sliders->map(function($slider) {
                    return [
                        'id' => $slider->id,
                        'page' => $slider->page,
                        'image_url' => $slider->image ? url('storage/' . $slider->image) : null,
                        'image_path' => $slider->image,
                        'order' => $slider->order,
                        'created_at' => $slider->created_at,
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch sliders',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload a new slider image
     */
    public function adminUploadSlider(Request $request)
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
        try {
            $validated = $request->validate([
                'page' => 'required|in:home,products,liveperfume,hotelamenities',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10MB max
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }

        try {
            // Get the highest order number for this page
            $maxOrder = Slider::where('page', $validated['page'])->max('order') ?? -1;
            $newOrder = $maxOrder + 1;

            // Handle image upload
            $image = $request->file('image');
            $folderPath = public_path('storage/images/sliders/' . $validated['page']);

            // Create directory if it doesn't exist
            if (!is_dir($folderPath)) {
                mkdir($folderPath, 0755, true);
            }

            // Generate unique filename
            $filename = 'slider_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

            // Move image to folder
            $image->move($folderPath, $filename);

            // Create slider record
            $slider = Slider::create([
                'page' => $validated['page'],
                'image' => 'images/sliders/' . $validated['page'] . '/' . $filename,
                'order' => $newOrder
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Slider uploaded successfully',
                'slider' => [
                    'id' => $slider->id,
                    'page' => $slider->page,
                    'image_url' => url('storage/' . $slider->image),
                    'image_path' => $slider->image,
                    'order' => $slider->order,
                    'created_at' => $slider->created_at,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to upload slider',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a slider
     */
    public function adminDeleteSlider($id)
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
            $slider = Slider::find($id);

            if (!$slider) {
                return response()->json([
                    'success' => false,
                    'error' => 'Slider not found'
                ], 404);
            }

            // Delete the image file from storage
            if ($slider->image) {
                $imagePath = public_path('storage/' . $slider->image);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            // Store page and order for reordering
            $page = $slider->page;
            $deletedOrder = $slider->order;

            // Delete the slider record
            $slider->delete();

            // Reorder remaining sliders on this page
            Slider::where('page', $page)
                ->where('order', '>', $deletedOrder)
                ->decrement('order');

            return response()->json([
                'success' => true,
                'message' => 'Slider deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete slider',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reorder sliders for a specific page
     */
    public function adminReorderSliders(Request $request)
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
            'page' => 'required|in:home,products,liveperfume,hotelamenities',
            'slider_ids' => 'required|array',
            'slider_ids.*' => 'required|integer|exists:sliders,id'
        ]);

        try {
            // Update order for each slider
            foreach ($validated['slider_ids'] as $index => $sliderId) {
                Slider::where('id', $sliderId)
                    ->where('page', $validated['page'])
                    ->update(['order' => $index]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Sliders reordered successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to reorder sliders',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
