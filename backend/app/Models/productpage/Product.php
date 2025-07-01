<?php

namespace App\Models\productpage;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products'; // Ensure this matches your table name

    protected $fillable = [
        'name',
        'scent',
        'volume_ml',
        'price',
        'original_price',
        'discount_amount',
        'is_discount_active',
        'delivery_charge',
        'available_quantity',
        'rating',
        'reviews_count',
        'image',
        'image_path',
        'flag',
        'note',
        'discription',
        'about_product',
        'extra_images',
        'ingredients',
        'ingridiance',
        'profit',
        'colour',
        'brand',
        'item_form',
        'power_source',
        'about',
        'old_price',
        'launch_date',
    ];

    // Automatically cast JSON columns to arrays
    protected $casts = [
        'extra_images' => 'array',
        'is_discount_active' => 'boolean',
        'launch_date' => 'date',
    ];

    // Accessor: image URL
    public function getImageUrlAttribute()
    {
        return $this->image ? Storage::url($this->image) : null;
    }

    // Appended attributes for JSON output
    protected $appends = ['image_url'];
}
