<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = ['name','email','phone','password','google_id','email_verified_at','otp','otp_expires_at'];
    protected $hidden   = ['password','otp','otp_expires_at','remember_token'];
    protected $casts    = ['email_verified_at' => 'datetime','otp_expires_at' => 'datetime'];

    public function getJWTIdentifier() { return $this->getKey(); }
    public function getJWTCustomClaims() { return []; }

    public function addresses() { return $this->hasMany(UserAddress::class); }
    public function orders()    { return $this->hasMany(Order::class); }
    public function wishlist()  { return $this->hasMany(Wishlist::class); }
    public function reviews()   { return $this->hasMany(ProductReview::class); }
    public function cart()      { return $this->hasMany(Cart::class); }

    public function isEmailVerified(): bool { return $this->email_verified_at !== null; }
}