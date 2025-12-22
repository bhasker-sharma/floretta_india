<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class BlogController extends Controller
{
    // Public: Get all published blogs
    public function index(Request $request) {
        $query = Blog::with('categories')->where('is_draft', false);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Pagination
        $blogs = $query->latest()->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $blogs
        ]);
    }

    // Public: Get single blog
    public function show($id) {
        $blog = Blog::with('categories')->where('id', $id)->where('is_draft', false)->first();

        if (!$blog) {
            return response()->json(['success' => false, 'message' => 'Blog not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $blog]);
    }

    // Admin: Get all blogs (including drafts)
    public function adminIndex(Request $request) {
        $query = Blog::with('categories');

        if ($request->has('q')) {
            $q = $request->q;
            $query->where(function($qq) use ($q) {
                $qq->where('title', 'like', "%{$q}%")
                   ->orWhere('category', 'like', "%{$q}%");
            });
        }

        $blogs = $query->latest()->paginate(20);

        return response()->json(['success' => true, 'data' => $blogs]);
    }

    // Admin: Create Blog
    public function store(Request $request) {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'category' => 'required|string|max:100',
            'content' => 'nullable|string',
            'image_file' => 'nullable|image|max:5120', // 5MB max
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:blog_categories,id',
        ]);

        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            // Store in public/blogs
            $file->move(public_path('uploads/blogs'), $filename);
            $imagePath = 'uploads/blogs/' . $filename;
        }

        $blog = Blog::create([
            'title' => $request->title,
            'author' => $request->author,
            'category' => $request->category,
            'content' => $request->content,
            'image' => $imagePath,
            'is_draft' => filter_var($request->is_draft, FILTER_VALIDATE_BOOLEAN)
        ]);

        // Attach categories if provided
        if ($request->has('category_ids') && is_array($request->category_ids)) {
            $blog->categories()->sync($request->category_ids);
        }

        return response()->json(['success' => true, 'message' => 'Blog created successfully', 'data' => $blog]);
    }

    // Admin: Update Blog
    public function update(Request $request, $id) {
        $blog = Blog::find($id);
        if (!$blog) {
            return response()->json(['success' => false, 'message' => 'Blog not found'], 404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'category' => 'required|string|max:100',
            'content' => 'nullable|string',
            'image_file' => 'nullable|image|max:5120',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:blog_categories,id',
        ]);

        if ($request->hasFile('image_file')) {
            // Delete old image if exists
            if ($blog->image && file_exists(public_path($blog->image))) {
                @unlink(public_path($blog->image));
            }

            $file = $request->file('image_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/blogs'), $filename);
            $blog->image = 'uploads/blogs/' . $filename;
        }

        $blog->title = $request->title;
        $blog->author = $request->author;
        $blog->category = $request->category;
        $blog->content = $request->content;

        if ($request->has('is_draft')) {
             $blog->is_draft = filter_var($request->is_draft, FILTER_VALIDATE_BOOLEAN);
        }

        $blog->save();

        // Sync categories if provided
        if ($request->has('category_ids') && is_array($request->category_ids)) {
            $blog->categories()->sync($request->category_ids);
        }

        return response()->json(['success' => true, 'message' => 'Blog updated successfully', 'data' => $blog]);
    }

    // Admin: Delete Blog
    public function destroy($id) {
        $blog = Blog::find($id);
        if (!$blog) {
            return response()->json(['success' => false, 'message' => 'Blog not found'], 404);
        }

        if ($blog->image && file_exists(public_path($blog->image))) {
            @unlink(public_path($blog->image));
        }

        $blog->delete();
        return response()->json(['success' => true, 'message' => 'Blog deleted successfully']);
    }

    // Admin: Toggle Status
    public function toggleStatus($id) {
        $blog = Blog::find($id);
        if (!$blog) {
            return response()->json(['success' => false, 'message' => 'Blog not found'], 404);
        }

        $blog->is_draft = !$blog->is_draft;
        $blog->save();

        return response()->json([
            'success' => true,
            'message' => 'Blog status updated',
            'is_draft' => $blog->is_draft
        ]);
    }

    // Admin: Get all categories
    public function getCategories() {
        $categories = BlogCategory::orderBy('name')->get();
        return response()->json(['success' => true, 'data' => $categories]);
    }

    // Admin: Create Category
    public function storeCategory(Request $request) {
        $request->validate([
            'name' => 'required|string|max:100|unique:blog_categories,name',
        ]);

        $category = BlogCategory::create([
            'name' => $request->name,
        ]);

        return response()->json(['success' => true, 'message' => 'Category created successfully', 'data' => $category]);
    }

    // Admin: Delete Category
    public function destroyCategory($id) {
        $category = BlogCategory::find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }

        $category->delete();
        return response()->json(['success' => true, 'message' => 'Category deleted successfully']);
    }
}
