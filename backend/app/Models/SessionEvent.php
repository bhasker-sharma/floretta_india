<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'event',
        'page',
        'metadata',
        
    ];

    protected $casts = [
        'metadata' => 'array',   // automatically convert JSON to array
    ];
}