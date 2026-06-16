<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    protected $fillable = ['page','image_url','alt_text','link_url','sort_order','is_active'];
    protected $casts    = ['is_active' => 'boolean'];
    public function scopeActive($q) { return $q->where('is_active', true); }
}