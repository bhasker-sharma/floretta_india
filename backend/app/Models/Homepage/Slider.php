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
        // Return the correct storage path
        if (!$this->image) return null;
        if (str_starts_with($this->image, 'http')) return $this->image;
        // Construct the correct storage URL manually
        return '/storage/' . $this->image;
    }

    // Optional: if you want to append 'image_url' automatically in JSON
    protected $appends = ['image_url'];
}
