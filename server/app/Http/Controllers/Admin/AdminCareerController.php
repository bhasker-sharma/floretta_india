<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobVacancy;
use App\Models\JobApplication;
use Illuminate\Http\Request;

class AdminCareerController extends Controller
{
    public function index()
    {
        return response()->json(JobVacancy::withCount('applications')->orderBy('sort_order')->get());
    }

    public function store(Request $r)
    {
        return response()->json(JobVacancy::create($r->all()), 201);
    }

    public function update(Request $r, $id)
    {
        $vacancy = JobVacancy::findOrFail($id);
        $vacancy->update($r->all());
        return response()->json($vacancy->fresh());
    }

    public function destroy($id)
    {
        JobVacancy::findOrFail($id)->delete();
        return response()->json(['message' => 'Vacancy deleted.']);
    }

    public function applications(Request $r)
    {
        $q = JobApplication::with('vacancy')->orderByDesc('created_at');
        if ($r->status) $q->where('status', $r->status);
        return response()->json($q->paginate(20));
    }

    public function updateApplicationStatus(Request $r, $id)
    {
        $app = JobApplication::findOrFail($id);
        $app->update(['status' => $r->status, 'admin_notes' => $r->admin_notes]);
        return response()->json($app->fresh());
    }
}