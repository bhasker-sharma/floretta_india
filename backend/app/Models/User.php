<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

// ✅ ADD THIS:
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

protected $fillable = [
    'name',
    'email',
    'password',
    'mobile',
    'address',
    'address1',
    'address2',
    'address3',
    'address4',
    'address5',
    'pin',
    'city',
    'image',
    'google_id',
];



    protected $hidden = [
        'password',
        'remember_token',
    ];

    // ✅ REQUIRED METHODS for JWT:
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
    public function wishlists()
{
    return $this->hasMany(Wishlist::class);
}

}
