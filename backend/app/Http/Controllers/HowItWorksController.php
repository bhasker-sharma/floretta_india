<?php

namespace App\Http\Controllers;

use App\Models\LivePerfume\HowItWorks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HowItWorksController extends Controller
{
    /**
     * Get all how_it_works items for admin
     */
    public function index()
    {
        $items = HowItWorks::orderBy('created_at', 'desc')->get();

        $items = $items->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'subtitle' => $item->subtitle,
                'image' => $item->image,
                'image_url' => $item->image ? url('storage/' . $item->image) : null,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });

        return response()->json([
            'success' => true,
            'items' => $items
        ]);
    }

    /**
     * Upload new how_it_works item
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }

        try {
            $imagePath = null;

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $folderPath = public_path('storage/images/how_it_works');

                if (!file_exists($folderPath)) {
                    mkdir($folderPath, 0755, true);
                }

                $image->move($folderPath, $filename);
                $imagePath = 'images/how_it_works/' . $filename;
            }

            $item = HowItWorks::create([
                'title' => $request->title,
                'subtitle' => $request->subtitle,
                'image' => $imagePath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'How It Works item created successfully',
                'item' => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'subtitle' => $item->subtitle,
                    'image' => $item->image,
                    'image_url' => $item->image ? url('storage/' . $item->image) : null,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to create item: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update existing how_it_works item
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }

        try {
            $item = HowItWorks::findOrFail($id);

            $item->title = $request->title;
            $item->subtitle = $request->subtitle;

            // Handle new image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($item->image) {
                    $oldImagePath = public_path('storage/' . $item->image);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }

                $image = $request->file('image');
                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $folderPath = public_path('storage/images/how_it_works');

                if (!file_exists($folderPath)) {
                    mkdir($folderPath, 0755, true);
                }

                $image->move($folderPath, $filename);
                $item->image = 'images/how_it_works/' . $filename;
            }

            $item->save();

            return response()->json([
                'success' => true,
                'message' => 'How It Works item updated successfully',
                'item' => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'subtitle' => $item->subtitle,
                    'image' => $item->image,
                    'image_url' => $item->image ? url('storage/' . $item->image) : null,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to update item: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete how_it_works item
     */
    public function destroy($id)
    {
        try {
            $item = HowItWorks::findOrFail($id);

            // Delete image file if exists
            if ($item->image) {
                $imagePath = public_path('storage/' . $item->image);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            $item->delete();

            return response()->json([
                'success' => true,
                'message' => 'How It Works item deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete item: ' . $e->getMessage()
            ], 500);
        }
    }
}
