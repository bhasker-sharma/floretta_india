<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = ['product_id','label','weight_grams','price','compare_price','stock_qty','is_default','sort_order'];
    protected $casts    = ['is_default' => 'boolean'];

    public function product() { return $this->belongsTo(Product::class); }

    public function getIsInStockAttribute(): bool { return $this->stock_qty > 0; }
    public function scopeDefault($q)              { return $q->where('is_default', true); }
}