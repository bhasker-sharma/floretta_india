<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $fillable = ['vacancy_id','name','email','phone','cover_letter_text','resume_path','status','admin_notes'];
    public function vacancy() { return $this->belongsTo(JobVacancy::class); }
}