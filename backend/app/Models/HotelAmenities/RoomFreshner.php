<?php

namespace App\Models\HotelAmenities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomFreshner extends Model
{
    use HasFactory;

    protected $table = 'room_freshner';

    protected $fillable = [
        'name',
        'image'
    ];
}
