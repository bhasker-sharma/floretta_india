<?php
namespace App\Http\Controllers;

use App\Models\Homepage\Coco;
use App\Models\Homepage\Homeproduct;
use App\Models\Homepage\Slider;
use App\Models\Homepage\Image;
use App\Models\Homepage\Uproduct;
use App\Models\Homepage\Testimonial;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $hproducts = Homeproduct::all();
        $sliders = Slider::all();
        $images = Image::all();
        $coco = Coco::find(1);
        $uproducts = Uproduct::all();
        $testimonials = Testimonial::all();

        return response()->json([
            'homeproducts' => $hproducts,
            'sliders' => $sliders,
            'images' => $images,
            'coco' => $coco,
            'uproducts' => $uproducts,
            'testimonials' => $testimonials,
        ]);
    }
}
