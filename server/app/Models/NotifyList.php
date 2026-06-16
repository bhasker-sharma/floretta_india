<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class NotifyList extends Model
{
    protected $fillable = ['email','source'];
    protected $table    = 'notify_list';
}