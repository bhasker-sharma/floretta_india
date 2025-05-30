<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LivePerfume\HowItWorks;

class HowItWorksController extends Controller
{
    // GET: Return all "how it works" steps
    public function index()
    {
        return response()->json(HowItWorks::all());
    }

    // POST: Store new step (optional, for admin use)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'subtitle' => 'required|string',
            'image' => 'required|string', // Assuming image path is already uploaded
        ]);

        $step = HowItWorks::create($validated);

        return response()->json($step, 201);
    }
}
