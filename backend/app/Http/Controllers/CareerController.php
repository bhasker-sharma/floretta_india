<?php

namespace App\Http\Controllers;

use App\Models\Career\JobVacancy;
use App\Models\Career\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class CareerController extends Controller
{
    /**
     * Get all active job vacancies (Public)
     */
    public function getActiveJobs()
    {
        $jobs = JobVacancy::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'jobs' => $jobs
        ]);
    }

    /**
     * Submit job application with resume upload (Public)
     */
    public function submitApplication(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_vacancy_id' => 'required|exists:job_vacancies,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'cover_letter_text' => 'nullable|string|max:2000',
            'cover_letter_file' => 'nullable|file|mimes:pdf,doc,docx|max:5120', // 5MB max
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }

        try {
            $resumePath = null;
            $coverLetterPath = null;

            // Handle resume upload
            if ($request->hasFile('resume')) {
                $resume = $request->file('resume');
                // Sanitize filename - remove spaces and special characters
                $originalName = str_replace([' ', '(', ')'], ['_', '', ''], $resume->getClientOriginalName());
                $filename = time() . '_' . uniqid() . '_' . $originalName;

                // Save to public_html/storage (web accessible)
                $publicHtmlPath = dirname(public_path()) . '/public_html/storage/resumes';
                if (!file_exists($publicHtmlPath)) {
                    mkdir($publicHtmlPath, 0755, true);
                }

                // Also save to public/storage (for backward compatibility)
                $publicPath = public_path('storage/resumes');
                if (!file_exists($publicPath)) {
                    mkdir($publicPath, 0755, true);
                }

                // Save the file to public_html
                $resume->move($publicHtmlPath, $filename);

                // Copy to public/storage for backup
                copy($publicHtmlPath . '/' . $filename, $publicPath . '/' . $filename);

                $resumePath = 'resumes/' . $filename;
            }

            // Handle cover letter file upload
            if ($request->hasFile('cover_letter_file')) {
                $coverLetter = $request->file('cover_letter_file');
                // Sanitize filename - remove spaces and special characters
                $originalName = str_replace([' ', '(', ')'], ['_', '', ''], $coverLetter->getClientOriginalName());
                $filename = time() . '_' . uniqid() . '_' . $originalName;

                // Save to public_html/storage (web accessible)
                $publicHtmlPath = dirname(public_path()) . '/public_html/storage/cover_letters';
                if (!file_exists($publicHtmlPath)) {
                    mkdir($publicHtmlPath, 0755, true);
                }

                // Also save to public/storage (for backward compatibility)
                $publicPath = public_path('storage/cover_letters');
                if (!file_exists($publicPath)) {
                    mkdir($publicPath, 0755, true);
                }

                // Save the file to public_html
                $coverLetter->move($publicHtmlPath, $filename);

                // Copy to public/storage for backup
                copy($publicHtmlPath . '/' . $filename, $publicPath . '/' . $filename);

                $coverLetterPath = 'cover_letters/' . $filename;
            }

            $application = JobApplication::create([
                'job_vacancy_id' => $request->job_vacancy_id,
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'cover_letter' => $request->cover_letter_text,
                'cover_letter_path' => $coverLetterPath,
                'resume_path' => $resumePath,
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Application submitted successfully! We will review your application and get back to you soon.',
                'application_id' => $application->id
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to submit application: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all job vacancies for admin
     */
    public function adminGetAllJobs()
    {
        $jobs = JobVacancy::withCount('applications')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'jobs' => $jobs
        ]);
    }

    /**
     * Create new job vacancy (Admin)
     */
    public function adminCreateJob(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'job_type' => 'required|in:full-time,part-time,contract,internship',
            'experience_required' => 'nullable|string|max:255',
            'qualifications' => 'nullable|string',
            'responsibilities' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }

        try {
            $job = JobVacancy::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Job vacancy created successfully',
                'job' => $job
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to create job: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update job vacancy (Admin)
     */
    public function adminUpdateJob(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'job_type' => 'required|in:full-time,part-time,contract,internship',
            'experience_required' => 'nullable|string|max:255',
            'qualifications' => 'nullable|string',
            'responsibilities' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }

        try {
            $job = JobVacancy::findOrFail($id);
            $job->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Job vacancy updated successfully',
                'job' => $job
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to update job: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete job vacancy (Admin)
     */
    public function adminDeleteJob($id)
    {
        try {
            $job = JobVacancy::findOrFail($id);
            
            // Delete associated application files
            $applications = $job->applications;
            foreach ($applications as $application) {
                if ($application->resume_path) {
                    $resumePath = public_path('storage/' . $application->resume_path);
                    if (file_exists($resumePath)) {
                        unlink($resumePath);
                    }
                }
                if ($application->cover_letter_path) {
                    $coverLetterPath = public_path('storage/' . $application->cover_letter_path);
                    if (file_exists($coverLetterPath)) {
                        unlink($coverLetterPath);
                    }
                }
            }

            $job->delete();

            return response()->json([
                'success' => true,
                'message' => 'Job vacancy deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete job: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle job active status (Admin)
     */
    public function adminToggleJobStatus($id)
    {
        try {
            $job = JobVacancy::findOrFail($id);
            $job->is_active = !$job->is_active;
            $job->save();

            return response()->json([
                'success' => true,
                'message' => 'Job status updated successfully',
                'job' => $job
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to update job status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all job applications (Admin)
     */
    public function adminGetApplications(Request $request)
    {
        $query = JobApplication::with('jobVacancy')
            ->orderBy('created_at', 'desc');

        // Filter by job_id if provided
        if ($request->has('job_id') && $request->job_id) {
            $query->where('job_vacancy_id', $request->job_id);
        }

        $applications = $query->get();

        $applications = $applications->map(function ($app) {
            return [
                'id' => $app->id,
                'job_vacancy_id' => $app->job_vacancy_id,
                'job_title' => $app->jobVacancy->title ?? 'N/A',
                'name' => $app->name,
                'email' => $app->email,
                'phone' => $app->phone,
                'cover_letter' => $app->cover_letter,
                'cover_letter_path' => $app->cover_letter_path,
                'cover_letter_url' => $app->cover_letter_path ? url('storage/' . $app->cover_letter_path) : null,
                'resume_path' => $app->resume_path,
                'resume_url' => $app->resume_path ? url('storage/' . $app->resume_path) : null,
                'status' => $app->status,
                'comments' => $app->comments,
                'created_at' => $app->created_at,
            ];
        });

        return response()->json([
            'success' => true,
            'applications' => $applications
        ]);
    }

    /**
     * Download resume (Admin)
     */
    public function adminDownloadResume($id)
    {
        try {
            $application = JobApplication::findOrFail($id);

            if (!$application->resume_path) {
                return response()->json([
                    'success' => false,
                    'error' => 'Resume not found'
                ], 404);
            }

            $resumePath = public_path('storage/' . $application->resume_path);

            if (!file_exists($resumePath)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Resume file not found'
                ], 404);
            }

            return response()->download($resumePath);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to download resume: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download cover letter (Admin)
     */
    public function adminDownloadCoverLetter($id)
    {
        try {
            $application = JobApplication::findOrFail($id);

            if (!$application->cover_letter_path) {
                return response()->json([
                    'success' => false,
                    'error' => 'Cover letter file not found'
                ], 404);
            }

            $coverLetterPath = public_path('storage/' . $application->cover_letter_path);

            if (!file_exists($coverLetterPath)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Cover letter file not found'
                ], 404);
            }

            return response()->download($coverLetterPath);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to download cover letter: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update application status (Admin)
     */
    public function adminUpdateApplicationStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,shortlisted,interviewing,selected,rejected,offered'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }

        try {
            $application = JobApplication::findOrFail($id);
            $application->status = $request->status;
            $application->save();

            return response()->json([
                'success' => true,
                'message' => 'Application status updated successfully',
                'application' => $application
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to update status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update application comments (Admin)
     */
    public function adminUpdateApplicationComments(Request $request, $id)
    {
        \Log::info('adminUpdateApplicationComments called', [
            'id' => $id,
            'request_data' => $request->all()
        ]);

        $validator = Validator::make($request->all(), [
            'comments' => 'nullable|string|max:5000'
        ]);

        if ($validator->fails()) {
            \Log::error('Validation failed', ['errors' => $validator->errors()->toArray()]);
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }

        try {
            $application = JobApplication::findOrFail($id);
            \Log::info('Application found', ['application_id' => $application->id]);

            $application->comments = $request->comments;
            $application->save();

            \Log::info('Comments saved successfully', [
                'application_id' => $application->id,
                'comments' => $application->comments
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Comments updated successfully',
                'application' => $application
            ]);
        } catch (\Exception $e) {
            \Log::error('Exception in adminUpdateApplicationComments', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'error' => 'Failed to update comments: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete job application (Admin)
     */
    public function adminDeleteApplication($id)
    {
        try {
            $application = JobApplication::findOrFail($id);

            // Delete associated files
            if ($application->resume_path) {
                $resumePath = public_path('storage/' . $application->resume_path);
                if (file_exists($resumePath)) {
                    unlink($resumePath);
                }
            }

            if ($application->cover_letter_path) {
                $coverLetterPath = public_path('storage/' . $application->cover_letter_path);
                if (file_exists($coverLetterPath)) {
                    unlink($coverLetterPath);
                }
            }

            // Delete the application record
            $application->delete();

            return response()->json([
                'success' => true,
                'message' => 'Application deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete application: ' . $e->getMessage()
            ], 500);
        }
    }
}
