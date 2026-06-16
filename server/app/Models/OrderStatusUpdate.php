<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class OrderStatusUpdate extends Model
{
    protected $fillable = ['order_id','status','note','tracking_number','updated_by_admin_id'];
    public function order() { return $this->belongsTo(Order::class); }
    public function admin() { return $this->belongsTo(Admin::class, 'updated_by_admin_id'); }
}