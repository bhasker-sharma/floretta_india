<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\productpage\Product;

class Wishlist extends Model
{
    protected $fillable = ['user_id', 'product_id'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
}
