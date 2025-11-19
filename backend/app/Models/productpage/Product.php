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
        'is_bestseller',
        'bestseller_order',
        'delivery_charge',
        'available_quantity',
        'rating',
        'reviews_count',
        'reviews',
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
        'is_bestseller' => 'boolean',
        'launch_date' => 'date',
    ];

    // Accessor: image URL
    public function getImageUrlAttribute()
    {
        return $this->image ? Storage::url($this->image) : null;
    }

    // Accessor: Get all image URLs
    public function getAllImagesAttribute()
    {
        if ($this->relationLoaded('images') && $this->images->count() > 0) {
            return $this->images->map(function($image) {
                // Use storage path to match existing images
                return [
                    'id' => $image->id,
                    'path' => $image->image_path,
                    'url' => url('storage/' . $image->image_path),
                    'sort_order' => $image->sort_order,
                    'is_primary' => $image->is_primary
                ];
            })->toArray();
        }
        return [];
    }

    // Appended attributes for JSON output
    protected $appends = ['image_url', 'all_images'];

    /**
     * Get all images for the product
     */
    public function images()
    {
        return $this->hasMany(\App\Models\ProductImage::class)->orderBy('sort_order');
    }

    /**
     * Get the primary image for the product
     */
    public function primaryImage()
    {
        return $this->hasOne(\App\Models\ProductImage::class)->where('is_primary', true);
    }
}
