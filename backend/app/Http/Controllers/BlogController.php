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
            // Sanitize filename - remove spaces and special characters
            $originalName = str_replace([' ', '(', ')'], ['_', '', ''], $file->getClientOriginalName());
            $filename = time() . '_' . $originalName;

            // Save to public_html/uploads (web accessible)
            $publicHtmlPath = dirname(public_path()) . '/public_html/uploads/blogs';
            if (!is_dir($publicHtmlPath)) {
                mkdir($publicHtmlPath, 0755, true);
            }

            // Also save to public/uploads (for backward compatibility)
            $publicPath = public_path('uploads/blogs');
            if (!is_dir($publicPath)) {
                mkdir($publicPath, 0755, true);
            }

            // Move file to public_html
            $file->move($publicHtmlPath, $filename);

            // Copy to public/uploads for backup
            copy($publicHtmlPath . '/' . $filename, $publicPath . '/' . $filename);

            $imagePath = 'uploads/blogs/' . $filename;
        }



        $blog = Blog::create([
            'title' => $request->title,
            'author' => $request->author,
            'category' => $request->category,
            'content' => $request->content,
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
            'sections' => 'nullable|string',
            'image_file' => 'nullable|image|max:5120',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:blog_categories,id',
        ]);

        if ($request->hasFile('image_file')) {
            // Delete old image if exists (from both locations)
            if ($blog->image) {
                $oldPublicHtmlPath = dirname(public_path()) . '/public_html/' . $blog->image;
                $oldPublicPath = public_path($blog->image);

                if (file_exists($oldPublicHtmlPath)) {
                    @unlink($oldPublicHtmlPath);
                }
                if (file_exists($oldPublicPath)) {
                    @unlink($oldPublicPath);
                }
            }

            $file = $request->file('image_file');
            // Sanitize filename - remove spaces and special characters
            $originalName = str_replace([' ', '(', ')'], ['_', '', ''], $file->getClientOriginalName());
            $filename = time() . '_' . $originalName;

            // Save to public_html/uploads (web accessible)
            $publicHtmlPath = dirname(public_path()) . '/public_html/uploads/blogs';
            if (!is_dir($publicHtmlPath)) {
                mkdir($publicHtmlPath, 0755, true);
            }

            // Also save to public/uploads (for backward compatibility)
            $publicPath = public_path('uploads/blogs');
            if (!is_dir($publicPath)) {
                mkdir($publicPath, 0755, true);
            }

            // Move file to public_html
            $file->move($publicHtmlPath, $filename);

            // Copy to public/uploads for backup
            copy($publicHtmlPath . '/' . $filename, $publicPath . '/' . $filename);

            $blog->image = 'uploads/blogs/' . $filename;
        } elseif ($request->has('remove_image') && $request->remove_image === 'true') {
            // Remove existing image
             if ($blog->image) {
                $oldPublicHtmlPath = dirname(public_path()) . '/public_html/' . $blog->image;
                $oldPublicPath = public_path($blog->image);

                if (file_exists($oldPublicHtmlPath)) {
                    @unlink($oldPublicHtmlPath);
                }
                if (file_exists($oldPublicPath)) {
                    @unlink($oldPublicPath);
                }
                $blog->image = null;
            }
        }

        $blog->title = $request->title;
        $blog->author = $request->author;
        $blog->category = $request->category;
        $blog->content = $request->content;
        


        if ($request->has('is_draft')) {
             $blog->is_draft = filter_var($request->is_draft, FILTER_VALIDATE_BOOLEAN);
        }

        // Handle cleanup of removed content images
        $oldImages = $this->getImagesFromContent($blog->getOriginal('content'));
        $newImages = $this->getImagesFromContent($request->content);
        $deletedImages = array_diff($oldImages, $newImages);

        foreach ($deletedImages as $imagePath) {
            $this->deleteImage($imagePath);
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

        // Delete featured image from both locations
        if ($blog->image) {
            $publicHtmlPath = dirname(public_path()) . '/public_html/' . $blog->image;
            $publicPath = public_path($blog->image);

            if (file_exists($publicHtmlPath)) {
                @unlink($publicHtmlPath);
            }
            if (file_exists($publicPath)) {
                @unlink($publicPath);
            }
        }

        // Delete all content images
        $contentImages = $this->getImagesFromContent($blog->content);
        foreach ($contentImages as $imagePath) {
            $this->deleteImage($imagePath);
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

    // Admin: Upload inline image for blog content
    public function uploadImage(Request $request) {
        $request->validate([
            'image' => 'required|image|max:5120', // 5MB max
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            // Sanitize filename - remove spaces and special characters
            $originalName = str_replace([' ', '(', ')'], ['_', '', ''], $file->getClientOriginalName());
            $filename = time() . '_' . $originalName;

            // Save to public_html/uploads/blogs/inline (web accessible)
            $publicHtmlPath = dirname(public_path()) . '/public_html/uploads/blogs/inline';
            if (!is_dir($publicHtmlPath)) {
                mkdir($publicHtmlPath, 0755, true);
            }

            // Also save to public/uploads (for backward compatibility)
            $publicPath = public_path('uploads/blogs/inline');
            if (!is_dir($publicPath)) {
                mkdir($publicPath, 0755, true);
            }

            // Move file to public_html
            $file->move($publicHtmlPath, $filename);

            // Copy to public/uploads for backup
            copy($publicHtmlPath . '/' . $filename, $publicPath . '/' . $filename);

            $url = asset('uploads/blogs/inline/' . $filename);
            return response()->json(['success' => true, 'url' => $url]);
        }

        return response()->json(['success' => false, 'message' => 'No image file provided'], 400);
    }

    /**
     * Extract image paths from HTML content
     * Returns array of relative paths (e.g. 'uploads/blogs/inline/image.jpg')
     */
    private function getImagesFromContent($content) {
        $images = [];
        if (empty($content)) return $images;

        // Match src attributes containing 'uploads/blogs'
        // Regex: src=".../uploads/blogs/..."
        preg_match_all('/src="([^"]*uploads\/blogs\/[^"]*)"/i', $content, $matches);

        foreach ($matches[1] as $url) {
            // Extract relative path from URL
            // If URL is full (http://...), get path after domain
            // If relative, just take it
            $path = parse_url($url, PHP_URL_PATH);
            // Remove leading slash if present
            $path = ltrim($path, '/');
            
            // Only keep if it starts with uploads/blogs
            if (strpos($path, 'uploads/blogs') === 0) {
                $images[] = $path;
            }
        }

        return array_unique($images);
    }

    /**
     * Delete an image file from server
     */
    private function deleteImage($path) {
        if (empty($path)) return;

        $publicHtmlPath = dirname(public_path()) . '/public_html/' . $path;
        $publicPath = public_path($path);

        if (file_exists($publicHtmlPath)) {
            @unlink($publicHtmlPath);
        }
        if (file_exists($publicPath)) {
            @unlink($publicPath);
        }
    }
}
