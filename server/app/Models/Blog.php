<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = ['title','slug','category_id','author_name','excerpt','content','cover_image','status','published_at'];
    protected $casts    = ['published_at' => 'datetime'];

    public function category() { return $this->belongsTo(BlogCategory::class); }
    public function scopePublished($q) { return $q->where('status','published'); }
}