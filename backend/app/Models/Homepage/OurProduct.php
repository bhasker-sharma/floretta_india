<?php
namespace App\Models\Homepage;

use Illuminate\Database\Eloquent\Model;

class OurProduct extends Model
{
    protected $fillable = [
        'title',
        'image',
        'image_hover',
    ];
}
