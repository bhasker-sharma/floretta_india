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
    ];
}
