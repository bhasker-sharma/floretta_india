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
        'rating',
        'reviews_count',
        'image_path',
        'flag',
    ];
}
