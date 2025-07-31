<?php

namespace App\Models\productpage;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FreshnerMist extends Model
{
    use HasFactory;

    protected $table = 'freshner_mist';

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
        'image_path',
        'flag',
    ];
}
