<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\SessionEvent;

class SessionEventController extends Controller
{
    public function store(Request $request)
{
    try {
        $request->validate([
            'session_id' => 'required|string',
            'event' => 'required|string',
            'payload' => 'nullable|array',
            'metadata' => 'nullable|array',
        ]);
        $metadata = [
        'device' => 'desktop',
        'referrer' => null,
        'utm_source' => null,
        'utm_medium' => null,
        'utm_campaign' => null,
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
];
        SessionEvent::create([
            'session_id' => $request->session_id,
            'event' => $request->event,
            'page' => $request->payload['url'] ?? null,
            'metadata' => $metadata,
            'ip_address' => $request->ip(),
        ]);
    } catch (\Throwable $e) {
        // 🔥 NEVER break the frontend
        Log::error('SESSION TRACKING FAILED', [
            'error' => $e->getMessage(),
            'request' => $request->all(),
        ]);
    }

    // ✅ Always return success
    return response()->json(['status' => 'ok'], 201);
}

}