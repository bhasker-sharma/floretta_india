<?php
namespace App\Models\Homepage;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coco extends Model
{
    use HasFactory;
      protected $table = 'coco';
    protected $fillable = [
        'name',
        'brand',
        'price',
        'old_price',
        'size',
        'savings',
        'main_image',
        'image_2',
        'image_3',
        'image_4',
    ];
}
