<?php

namespace App\Models\LivePerfume;

use Illuminate\Database\Eloquent\Model;

class BarPackage extends Model
{
    protected $fillable = [
        'no_of_guests',
        'price',
        'category'
    ];
}
