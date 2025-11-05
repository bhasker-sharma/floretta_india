<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderStatusUpdate extends Model
{
    protected $table = 'order_status_updates';

    protected $fillable = [
        'order_id',
        'from_status',
        'to_status',
        'changed_by_admin_id',
        'note',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function changedByAdmin()
    {
        return $this->belongsTo(AdminAuth::class, 'changed_by_admin_id');
    }
}
