<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name','slug','tagline','description','description_short','description_long',
        'ingredients','how_to_use','sku','is_active','is_featured',
        'meta_title','meta_description',
    ];
    protected $casts = ['is_active' => 'boolean', 'is_featured' => 'boolean'];

    public function variants()  { return $this->hasMany(ProductVariant::class)->orderBy('sort_order'); }
    public function images()    { return $this->hasMany(ProductImage::class)->orderBy('sort_order'); }
    public function reviews()   { return $this->hasMany(ProductReview::class); }

    public function scopeActive($q) { return $q->where('is_active', true); }

    public function getPrimaryImageAttribute() {
        return $this->images->firstWhere('is_primary', true) ?? $this->images->first();
    }

    public function getAverageRatingAttribute(): float {
        return round($this->reviews()->where('status','approved')->avg('rating') ?? 0, 1);
    }

    public function getReviewCountAttribute(): int {
        return $this->reviews()->where('status','approved')->count();
    }
}