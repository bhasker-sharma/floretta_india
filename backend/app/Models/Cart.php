<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', // <-- required for auth:sanctum
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
