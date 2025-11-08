<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ContactEnquiryNotification;
use App\Models\HotelAmenities\RoomFreshner;
use App\Models\HotelAmenities\Contact;

class HotelAmenitiesController extends Controller
{
    // ----------------- Room Freshener Logic -----------------

    // GET all room fresheners
    public function index()
    {
        return response()->json(RoomFreshner::all());
    }

    // Store a new room freshener (optional for admin)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'image' => 'required|string'
        ]);

        $freshner = RoomFreshner::create($request->all());

        return response()->json($freshner, 201);
    }

    // ----------------- Contact Form Submission -----------------

    public function submitContactForm(Request $request)
    {
        $validated = $request->validate([
            'hotel_name' => 'required|string|max:255',
            'email' => 'required|email',
            'mobile' => 'required|string|max:20',
            'packaging_option' => 'required|string',
            'preferred_fragrance' => 'required|string',
            'estimated_quantity' => 'required|string',
            'additional_requirements' => 'nullable|string',
        ]);

        $contact = Contact::create($validated);

        // Attempt to notify dedicated admin via email (non-blocking for user)
        try {
            $adminEmail = env('CONTACT_ENQUIRY_EMAIL') ?: env('MAIL_FROM_ADDRESS');
            if ($adminEmail) {
                Mail::to($adminEmail)->send(new ContactEnquiryNotification($contact));
                Log::info('Hotel Amenities contact enquiry email sent', [
                    'contact_id' => $contact->id,
                    'admin_email' => $adminEmail,
                ]);
            } else {
                Log::warning('No contact enquiry admin email configured. Set CONTACT_ENQUIRY_EMAIL in .env');
            }
        } catch (\Throwable $e) {
            Log::error('Failed to send hotel amenities contact enquiry email', [
                'contact_id' => $contact->id ?? null,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json(['message' => 'Contact submitted successfully.'], 201);
    }
}
