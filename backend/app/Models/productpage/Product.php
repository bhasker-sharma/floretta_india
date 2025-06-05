<?php

namespace App\Models\productpage;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'main_image',
        'extra_images',       // Can be stored as JSON
        'features',           // Optional: Can be JSON array or stringified
        'ingredients',
        'profit',
        'launch_date',
    ];

    protected $casts = [
        'extra_images' => 'array', // Automatically casts JSON to array
        'features'     => 'array',
        'launch_date'  => 'date',
    ];

    // Optional: Define relation to ProductDetails if needed
    public function details()
    {
        return $this->hasOne(ProductDetails::class, 'product_id');
    }
}
