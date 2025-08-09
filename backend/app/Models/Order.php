<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'razorpay_order_id',
        'razorpay_payment_id',
        'status',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'order_value',
        'order_quantity',
        'order_items',
    ];
    protected $casts = [
        'order_items' => 'array',
        'order_value' => 'decimal:2',
    ];
}
