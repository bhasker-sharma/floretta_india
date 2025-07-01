<?php

namespace App\Http\Controllers;

use App\Models\Admin;
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

        $admin = Admin::where('email', $request->email)->first();

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

    /**
     * Get authenticated admin details
     */
    public function me(Request $request)
    {
        // For now, we'll implement a simple token verification
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            $decoded = base64_decode($token);
            $parts = explode(':', $decoded);
            $adminId = $parts[0];
            
            $admin = Admin::find($adminId);
            
            if (!$admin) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            return response()->json([
                'admin' => [
                    'id' => $admin->id,
                    'email' => $admin->email,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }
}
