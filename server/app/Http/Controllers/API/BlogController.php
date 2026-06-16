<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Blog;

class BlogController extends Controller
{
    public function index()
    {
        return response()->json(
            Blog::published()->with('category')->orderByDesc('published_at')->paginate(12)
        );
    }

    public function show($slug)
    {
        return response()->json(
            Blog::published()->with('category')->where('slug', $slug)->firstOrFail()
        );
    }
}