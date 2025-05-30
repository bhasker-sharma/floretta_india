<?php

namespace App\Models\productpage;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductDetails extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'description',
        'volume_ml',
        'longevity_hours',
        'ingredients',
        'usage_instructions',
        'about_product',  // <--- Add this line
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
