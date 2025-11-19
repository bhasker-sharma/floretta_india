<?php
namespace App\Http\Controllers;

use App\Models\Homepage\Coco;
use App\Models\Homepage\Slider;
use App\Models\Homepage\Image;
use App\Models\Homepage\Uproduct;
use App\Models\Homepage\Testimonial;
use App\Models\productpage\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
   public function index(Request $request)
{
    // $hproducts = Homeproduct::all();
    $sliders = Slider::where('id', '<=', 5)->get(); // ✅ only first 5 IDs
    $images = Image::all();
    $coco = Coco::find(1);
    $uproducts = Uproduct::all();
    $testimonials = Testimonial::all();

    // Get bestseller products ordered by bestseller_order
    $bestsellers = Product::where('is_bestseller', true)
        ->with('images')
        ->orderBy('bestseller_order', 'asc')
        ->orderBy('created_at', 'desc')
        ->limit(10)
        ->get();

    return response()->json([
        // 'homeproducts' => $hproducts,
        'sliders' => $sliders,
        'images' => $images,
        'coco' => $coco,
        'uproducts' => $uproducts,
        'testimonials' => $testimonials,
        'bestsellers' => $bestsellers,
    ]);
}

}
