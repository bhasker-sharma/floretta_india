<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LivePerfume\Booking;
use App\Models\LivePerfume\HowItWorks;
use App\Models\LivePerfume\BarPackage;

class LivePerfumeController extends Controller
{
    // ==============================
    // Combined GET API: All Data
    // ==============================
    public function index()
    {
        return response()->json([
            'how_it_works' => HowItWorks::all(),
            'bar_packages' => BarPackage::all(),
            'bookings'     => Booking::all(),
        ]);
    }

    // ====================
    // Booking Form API
    // ====================
    public function submitBooking(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email',
            'mobile' => 'required|string|max:15',
            'package' => 'required|string',
            'message' => 'nullable|string',
        ]);

        $booking = Booking::create($validated);

        return response()->json([
            'message' => 'Booking submitted successfully.',
            'data' => $booking,
        ], 201);
    }

    // ==============
    // INDIVIDUAL APIs (optional if still needed)
    // ==============
    public function getSteps()
    {
        return response()->json(HowItWorks::all());
    }

    public function getBarPackages()
    {
        $packages = BarPackage::all()->groupBy('category');
        return response()->json($packages);
    }
}