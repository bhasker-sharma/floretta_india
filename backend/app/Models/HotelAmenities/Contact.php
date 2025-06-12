<?php

namespace App\Models\HotelAmenities;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'hotel_name',
        'email',
        'mobile',
        'packaging_option',
        'preferred_fragrance',
        'estimated_quantity',
        'additional_requirements',
    ];
}