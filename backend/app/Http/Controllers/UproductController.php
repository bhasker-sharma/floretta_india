<?php

namespace App\Http\Controllers;

use App\Models\Homepage\Uproduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UproductController extends Controller
{
    /**
     * Get all uproducts for admin
     */
    public function index()
    {
        $uproducts = Uproduct::orderBy('created_at', 'desc')->get();

        $uproducts = $uproducts->map(function ($item) {
            return [
                'id' => $item->id,
                'image_path' => $item->image_path,
                'hover_image_path' => $item->hover_image_path,
                'image_url' => $item->image_path ? url('storage/' . $item->image_path) : null,
                'hover_image_url' => $item->hover_image_path ? url('storage/' . $item->hover_image_path) : null,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });

        return response()->json([
            'success' => true,
            'uproducts' => $uproducts
        ]);
    }

    /**
     * Upload new uproduct
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'hover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }

        try {
            $imagePath = null;
            $hoverImagePath = null;

            // Handle main image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $folderPath = public_path('storage/images/uproducts');

                if (!file_exists($folderPath)) {
                    mkdir($folderPath, 0755, true);
                }

                $image->move($folderPath, $filename);
                $imagePath = 'images/uproducts/' . $filename;
            }

            // Handle hover image upload
            if ($request->hasFile('hover_image')) {
                $hoverImage = $request->file('hover_image');
                $hoverFilename = time() . '_hover_' . uniqid() . '.' . $hoverImage->getClientOriginalExtension();
                $folderPath = public_path('storage/images/uproducts');

                if (!file_exists($folderPath)) {
                    mkdir($folderPath, 0755, true);
                }

                $hoverImage->move($folderPath, $hoverFilename);
                $hoverImagePath = 'images/uproducts/' . $hoverFilename;
            }

            $uproduct = Uproduct::create([
                'image_path' => $imagePath,
                'hover_image_path' => $hoverImagePath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Uproduct uploaded successfully',
                'uproduct' => [
                    'id' => $uproduct->id,
                    'image_path' => $uproduct->image_path,
                    'hover_image_path' => $uproduct->hover_image_path,
                    'image_url' => $uproduct->image_path ? url('storage/' . $uproduct->image_path) : null,
                    'hover_image_url' => $uproduct->hover_image_path ? url('storage/' . $uproduct->hover_image_path) : null,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to upload uproduct: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update existing uproduct
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'hover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }

        try {
            $uproduct = Uproduct::findOrFail($id);

            // Handle main image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($uproduct->image_path) {
                    $oldImagePath = public_path('storage/' . $uproduct->image_path);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }

                $image = $request->file('image');
                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $folderPath = public_path('storage/images/uproducts');

                if (!file_exists($folderPath)) {
                    mkdir($folderPath, 0755, true);
                }

                $image->move($folderPath, $filename);
                $uproduct->image_path = 'images/uproducts/' . $filename;
            }

            // Handle hover image upload
            if ($request->hasFile('hover_image')) {
                // Delete old hover image if exists
                if ($uproduct->hover_image_path) {
                    $oldHoverImagePath = public_path('storage/' . $uproduct->hover_image_path);
                    if (file_exists($oldHoverImagePath)) {
                        unlink($oldHoverImagePath);
                    }
                }

                $hoverImage = $request->file('hover_image');
                $hoverFilename = time() . '_hover_' . uniqid() . '.' . $hoverImage->getClientOriginalExtension();
                $folderPath = public_path('storage/images/uproducts');

                if (!file_exists($folderPath)) {
                    mkdir($folderPath, 0755, true);
                }

                $hoverImage->move($folderPath, $hoverFilename);
                $uproduct->hover_image_path = 'images/uproducts/' . $hoverFilename;
            }

            $uproduct->save();

            return response()->json([
                'success' => true,
                'message' => 'Uproduct updated successfully',
                'uproduct' => [
                    'id' => $uproduct->id,
                    'image_path' => $uproduct->image_path,
                    'hover_image_path' => $uproduct->hover_image_path,
                    'image_url' => $uproduct->image_path ? url('storage/' . $uproduct->image_path) : null,
                    'hover_image_url' => $uproduct->hover_image_path ? url('storage/' . $uproduct->hover_image_path) : null,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to update uproduct: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete uproduct
     */
    public function destroy($id)
    {
        try {
            $uproduct = Uproduct::findOrFail($id);

            // Delete main image file if exists
            if ($uproduct->image_path) {
                $imagePath = public_path('storage/' . $uproduct->image_path);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            // Delete hover image file if exists
            if ($uproduct->hover_image_path) {
                $hoverImagePath = public_path('storage/' . $uproduct->hover_image_path);
                if (file_exists($hoverImagePath)) {
                    unlink($hoverImagePath);
                }
            }

            $uproduct->delete();

            return response()->json([
                'success' => true,
                'message' => 'Uproduct deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete uproduct: ' . $e->getMessage()
            ], 500);
        }
    }
}
