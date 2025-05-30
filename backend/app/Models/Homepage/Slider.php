<?php
namespace App\Models\Homepage;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Slider extends Model
{
    use HasFactory;

    protected $fillable = ['image'];

    // Add this accessor for full image URL
    public function getImageUrlAttribute()
    {
        // This assumes images are stored in 'public' disk, e.g. storage/app/public/
        return Storage::url($this->image); // returns /storage/filename.jpg
    }

    // Optional: if you want to append 'image_url' automatically in JSON
    protected $appends = ['image_url'];
}
