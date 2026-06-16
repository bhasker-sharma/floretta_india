<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number','user_id','status','payment_status','payment_method',
        'razorpay_order_id','razorpay_payment_id','razorpay_signature',
        'subtotal','shipping_charge','total','shipping_address','items','notes'
    ];
    protected $casts = ['shipping_address' => 'array','items' => 'array'];

    public function user()          { return $this->belongsTo(User::class); }
    public function statusUpdates() { return $this->hasMany(OrderStatusUpdate::class)->orderBy('created_at'); }

    public function getIsPaidAttribute(): bool      { return $this->payment_status === 'paid'; }
    public function getIsDeliveredAttribute(): bool { return $this->status === 'delivered'; }
}