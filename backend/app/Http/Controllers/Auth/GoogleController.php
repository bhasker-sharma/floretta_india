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

            // Generate JWT token
            $token = JWTAuth::fromUser($user);

            // Redirect to frontend with token
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect($frontendUrl . '/auth/callback?token=' . $token . '&user=' . urlencode(json_encode($user)));

        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Google OAuth Error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            $errorMessage = urlencode($e->getMessage());
            return redirect($frontendUrl . '/userlogin?error=google_login_failed&message=' . $errorMessage);
        }
    }
}
