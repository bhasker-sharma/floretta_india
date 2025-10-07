<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table = 'admin_auth';

    protected $fillable = ['email', 'password'];

    protected $hidden = ['password'];
}
