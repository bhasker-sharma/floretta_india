<?php
namespace App\Models\Career;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobVacancy extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'location',
        'job_type',
        'experience_required',
        'qualifications',
        'responsibilities',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get all applications for this job vacancy
     */
    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }
}
