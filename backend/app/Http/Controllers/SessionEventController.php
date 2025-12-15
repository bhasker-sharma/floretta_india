<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SessionEvent;

class SessionEventController extends Controller
{
    public function store(Request $request)
    {
        SessionEvent::create([
            'session_id' => $request->session_id,
            'event' => $request->event,
            'page' => $request->page,
            'metadata' => $request->metadata,
        ]);

        return response()->json(['status' => 'ok']);

    }
}