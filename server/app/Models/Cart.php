<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = ['user_id','session_id','product_id','variant_id','qty','price_at_add'];

    public function product() { return $this->belongsTo(Product::class); }
    public function variant() { return $this->belongsTo(ProductVariant::class); }
    public function user()    { return $this->belongsTo(User::class); }
}