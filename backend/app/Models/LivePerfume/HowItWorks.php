<?php
namespace App\Models\LivePerfume;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HowItWorks extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'subtitle', 'image'];
}
