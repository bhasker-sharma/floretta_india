<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Admin extends Authenticatable implements JWTSubject
{
    protected $fillable = ['name','email','password','role','permissions'];
    protected $hidden   = ['password','remember_token'];
    protected $casts    = ['permissions' => 'array'];

    public function getJWTIdentifier() { return $this->getKey(); }
    public function getJWTCustomClaims() { return ['guard' => 'admin']; }

    public function hasPermission(string $key): bool {
        if ($this->role === 'super') return true;
        return in_array($key, $this->permissions ?? []);
    }
}