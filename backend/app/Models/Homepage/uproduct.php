<?php

namespace App\Models\Homepage;

use Illuminate\Database\Eloquent\Model;

class Uproduct extends Model
{
    // Tell Eloquent the exact table name (since it doesn't follow naming conventions)
    protected $table = 'uproducts';

    // Use integer auto-increment instead of Laravel's default 'id' as BigIncrements
    protected $primaryKey = 'id';
    public $incrementing = true;

    // Timestamps are managed manually (because you're using custom datetime with `useCurrent`)
    public $timestamps = true;

    // Define fillable fields
    protected $fillable = [
        'image_path',
        'hover_image_path',
        'created_at',
        'updated_at',
    ];
}
