<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\HotelAmenities\Contact;
use App\Models\LivePerfume\Booking;

class AdminEnquiryController extends Controller
{
    /**
     * List Hotel Amenities contact enquiries (admin only)
     */
    public function listContactEnquiries(Request $request)
    {
        $admin = auth('admin')->user();
        if (!$admin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'Admin authentication required'
            ], 401);
        }

        try {
            $query = Contact::query()->orderBy('created_at', 'desc');

            // Optional filters
            if ($search = trim((string) $request->query('q', ''))) {
                $query->where(function ($q) use ($search) {
                    $q->where('hotel_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('mobile', 'like', "%{$search}%");
                });
            }
            if ($start = $request->query('start_date')) {
                $query->whereDate('created_at', '>=', $start);
            }
            if ($end = $request->query('end_date')) {
                $query->whereDate('created_at', '<=', $end);
            }

            $perPage = (int) ($request->query('per_page', 20));
            $perPage = $perPage > 0 && $perPage <= 100 ? $perPage : 20;
            $data = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $data->items(),
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total' => $data->total(),
                    'last_page' => $data->lastPage(),
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to list contact enquiries', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch contact enquiries',
            ], 500);
        }
    }

    /**
     * List Live Perfume Bar bookings (admin only)
     */
    public function listPerfumeBarBookings(Request $request)
    {
        $admin = auth('admin')->user();
        if (!$admin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'Admin authentication required'
            ], 401);
        }

        try {
            $query = Booking::query()->orderBy('created_at', 'desc');

            // Optional filters
            if ($search = trim((string) $request->query('q', ''))) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('mobile', 'like', "%{$search}%")
                      ->orWhere('package', 'like', "%{$search}%");
                });
            }
            if ($start = $request->query('start_date')) {
                $query->whereDate('created_at', '>=', $start);
            }
            if ($end = $request->query('end_date')) {
                $query->whereDate('created_at', '<=', $end);
            }

            $perPage = (int) ($request->query('per_page', 20));
            $perPage = $perPage > 0 && $perPage <= 100 ? $perPage : 20;
            $data = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $data->items(),
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total' => $data->total(),
                    'last_page' => $data->lastPage(),
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to list perfume bar bookings', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch perfume bar bookings',
            ], 500);
        }
    }
}
