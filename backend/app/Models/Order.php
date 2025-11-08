<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $appends = ['is_verified'];

    protected $fillable = [
        'user_id',
        'order_number',
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
        'include_gst',
        'verified_at',
        'verified_by_admin_id',
        'order_status',
        'order_status_changed_at',
    ];
    protected $casts = [
        'order_items' => 'array',
        'order_value' => 'decimal:2',
        'include_gst' => 'boolean',
        'verified_at' => 'datetime',
        'order_status_changed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function verifiedByAdmin()
    {
        return $this->belongsTo(\App\Models\AdminAuth::class, 'verified_by_admin_id');
    }

    public function statusUpdates()
    {
        return $this->hasMany(OrderStatusUpdate::class);
    }

    public function getIsVerifiedAttribute(): bool
    {
        return !is_null($this->verified_at);
    }
}
