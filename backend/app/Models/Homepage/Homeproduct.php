<?php

// app/Models/Homepage/Homeproduct.php

namespace App\Models\Homepage;

use Illuminate\Database\Eloquent\Model;

class Homeproduct extends Model
{
    protected $table = 'homeproducts';

    protected $fillable = [
        'name',
        'image',
        'image_hover',
        'price',
        'old_price',
        'rating',
        'reviews',
    ];
}
