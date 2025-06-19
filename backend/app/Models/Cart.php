<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = [
        'product_id',
        'quantity',
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
        'image_path',
        'flag',
        'discription',
        'about_product',
        'extra_images',
        'ingridiance',
        'profit',
        'colour',
        'brand',
        'item_form',
        'power_source',
        'about',
    ];

}
