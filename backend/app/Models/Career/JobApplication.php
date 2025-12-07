<?php
namespace App\Models\Career;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_vacancy_id',
        'name',
        'email',
        'phone',
        'cover_letter',
        'cover_letter_path',
        'resume_path',
        'status',
        'comments'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the job vacancy this application belongs to
     */
    public function jobVacancy()
    {
        return $this->belongsTo(JobVacancy::class);
    }
}
