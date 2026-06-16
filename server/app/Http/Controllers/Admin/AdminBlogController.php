<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminBlogController extends Controller
{
    public function index()
    {
        return response()->json(Blog::with('category')->orderByDesc('created_at')->paginate(20));
    }

    public function store(Request $r)
    {
        $cover = null;
        if ($r->hasFile('cover_image')) {
            $cover = '/storage/'.$r->file('cover_image')->store('blogs', 'public');
        }
        $blog = Blog::create(array_merge($r->only(['title','category_id','author_name','excerpt','content','status']), [
            'slug'         => Str::slug($r->title).'-'.time(),
            'cover_image'  => $cover,
            'published_at' => $r->status === 'published' ? now() : null,
        ]));
        return response()->json($blog->load('category'), 201);
    }

    public function update(Request $r, $id)
    {
        $blog = Blog::findOrFail($id);
        $data = $r->only(['title','category_id','author_name','excerpt','content','status']);
        if (isset($data['status']) && $data['status'] === 'published' && !$blog->published_at) {
            $data['published_at'] = now();
        }
        if ($r->hasFile('cover_image')) {
            $data['cover_image'] = '/storage/'.$r->file('cover_image')->store('blogs','public');
        }
        $blog->update($data);
        return response()->json($blog->fresh()->load('category'));
    }

    public function destroy($id)
    {
        Blog::findOrFail($id)->delete();
        return response()->json(['message' => 'Blog deleted.']);
    }

    public function uploadImage(Request $r)
    {
        $path = $r->file('image')->store('blogs/inline', 'public');
        return response()->json(['url' => '/storage/'.$path]);
    }
}