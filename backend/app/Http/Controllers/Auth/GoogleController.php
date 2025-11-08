<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Tymon\JWTAuth\Facades\JWTAuth;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback(Request $request)
    {
        try {
            // Get SSL verification setting from environment (default: true for security)
            $sslVerify = env('GOOGLE_OAUTH_SSL_VERIFY', true);

            // SECURITY WARNING: Only disable SSL verification in local development
            // Production should ALWAYS have SSL verification enabled
            $httpClient = $sslVerify
                ? new \GuzzleHttp\Client()
                : new \GuzzleHttp\Client(['verify' => false]);

            $googleUser = Socialite::driver('google')
                ->stateless()
                ->setHttpClient($httpClient)
                ->user();

            // Find user by email or google_id
            $user = User::where('email', $googleUser->getEmail())
                ->orWhere('google_id', $googleUser->getId())
                ->first();

            if ($user) {
                // Update google_id if not set
                if (!$user->google_id) {
                    $user->google_id = $googleUser->getId();
                    $user->save();
                }
            } else {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'password' => bcrypt(Str::random(16)), // Random password for OAuth users
                    'email_verified_at' => now(), // Auto-verify email for Google users
                ]);
            }

            // SECURITY: Generate one-time code instead of exposing JWT in URL
            // OAuth2 Authorization Code Flow - prevents token leakage in URLs
            $code = Str::random(64);

            // Generate JWT token
            $token = JWTAuth::fromUser($user);

            // Store code temporarily in cache (5 minutes, single use)
            \Illuminate\Support\Facades\Cache::put('oauth_code_' . $code, [
                'token' => $token,
                'user' => $user->toArray(),
                'created_at' => now()->timestamp
            ], now()->addMinutes(5));

            // Redirect to frontend with code (NOT token)
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect($frontendUrl . '/auth/callback?code=' . $code);

        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Google OAuth Error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            $errorMessage = urlencode($e->getMessage());
            return redirect($frontendUrl . '/userlogin?error=google_login_failed&message=' . $errorMessage);
        }
    }

    /**
     * Exchange one-time code for JWT token (POST request)
     * SECURITY: Prevents token exposure in URLs, browser history, and server logs
     */
    public function exchangeCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:64'
        ]);

        $code = $request->input('code');
        $cacheKey = 'oauth_code_' . $code;

        // Retrieve data from cache
        $data = \Illuminate\Support\Facades\Cache::get($cacheKey);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired code'
            ], 400);
        }

        // Delete code immediately (single use only)
        \Illuminate\Support\Facades\Cache::forget($cacheKey);

        // Return token and user data
        return response()->json([
            'success' => true,
            'token' => $data['token'],
            'user' => $data['user']
        ]);
    }
}
