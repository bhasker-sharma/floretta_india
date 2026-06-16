<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\JobVacancy;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CareerController extends Controller
{
    public function index()
    {
        return response()->json(JobVacancy::active()->orderBy('sort_order')->get());
    }

    public function apply(Request $r, $id)
    {
        $vacancy = JobVacancy::findOrFail($id);
        $v = Validator::make($r->all(), [
            'name'  => 'required|string|max:100',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:15',
            'resume'=> 'nullable|file|mimes:pdf|max:5120',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $resumePath = null;
        if ($r->hasFile('resume')) {
            $resumePath = $r->file('resume')->store('resumes', 'public');
        }

        JobApplication::create([
            'vacancy_id'        => $vacancy->id,
            'name'              => $r->name,
            'email'             => $r->email,
            'phone'             => $r->phone,
            'cover_letter_text' => $r->cover_letter_text,
            'resume_path'       => $resumePath,
        ]);

        return response()->json(['message' => 'Application submitted successfully.'], 201);
    }
}