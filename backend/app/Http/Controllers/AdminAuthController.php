<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\AdminAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    /**
     * Handle admin login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $admin = AdminAuth::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create a simple token (you can implement JWT or Sanctum later)
        $token = base64_encode($admin->id . ':' . time());

        return response()->json([
            'message' => 'Login successful',
            'admin' => [
                'id' => $admin->id,
                'email' => $admin->email,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Handle admin logout
     */
    public function logout(Request $request)
    {
        return response()->json([
            'message' => 'Logout successful'
        ]);
    }
 }