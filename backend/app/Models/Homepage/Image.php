<?php
// app/Models/Image.php
namespace App\Models\Homepage;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = ['image_path', 'hover_image_path'];
}
