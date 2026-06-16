<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class JobVacancy extends Model
{
    protected $fillable = ['title','department','location','type','description','requirements','is_active','sort_order'];
    protected $casts    = ['is_active' => 'boolean'];

    public function applications() { return $this->hasMany(JobApplication::class, 'vacancy_id'); }
    public function scopeActive($q){ return $q->where('is_active', true); }
}