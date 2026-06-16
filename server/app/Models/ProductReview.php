<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ProductReview extends Model
{
    protected $fillable = ['product_id','user_id','order_id','rating','title','body','skin_type','status','is_featured'];
    protected $casts    = ['is_featured' => 'boolean'];

    public function product() { return $this->belongsTo(Product::class); }
    public function user()    { return $this->belongsTo(User::class); }
    public function order()   { return $this->belongsTo(Order::class); }

    public function scopeApproved($q)  { return $q->where('status','approved'); }
    public function scopeFeatured($q)  { return $q->where('is_featured', true); }

    public function getIsVerifiedPurchaseAttribute(): bool { return $this->order_id !== null; }
}