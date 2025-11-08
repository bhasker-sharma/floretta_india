<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wishlist;
use App\Rules\StrongPassword;
use App\Mail\SendOtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;

class UserController extends Controller
{
    // Register - Step 1: Create user and send OTP
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => ['required', 'string', 'confirmed', new StrongPassword()],
            'mobile'   => 'required|string|min:10',
            'address'  => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $validated = $validator->validated();

        // Generate 6-digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $otpExpiresAt = Carbon::now()->addMinutes(10);

        // Create user with OTP
        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'mobile'   => $validated['mobile'],
            'address'  => $validated['address'] ?? null,
            'email_verification_otp' => $otp,
            'otp_expires_at' => $otpExpiresAt,
            'email_verified' => false,
        ]);

        // Send OTP via email
        try {
            Mail::to($user->email)->send(new SendOtpMail($otp, $user->name));
        } catch (\Exception $e) {
            // If email fails, delete the user and return error
            $user->delete();
            return response()->json([
                'message' => 'Failed to send verification email. Please try again.'
            ], 500);
        }

        return response()->json([
            'message' => 'Registration successful! Please check your email for the verification code.',
            'email' => $user->email,
            'user_id' => $user->id,
        ], 201);
    }

    // Verify OTP - Step 2: Verify email with OTP
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp'   => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->email_verified) {
            return response()->json(['message' => 'Email already verified'], 400);
        }

        // Check if OTP is expired
        if (Carbon::now()->greaterThan($user->otp_expires_at)) {
            return response()->json(['message' => 'OTP has expired. Please request a new one.'], 400);
        }

        // Verify OTP
        if ($user->email_verification_otp !== $request->otp) {
            return response()->json(['message' => 'Invalid OTP'], 400);
        }

        // Mark email as verified
        $user->email_verified = true;
        $user->email_verification_otp = null;
        $user->otp_expires_at = null;
        $user->save();

        // Generate JWT token
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Email verified successfully!',
            'user'    => $user,
            'token'   => $token,
        ], 200);
    }

    // Resend OTP
    public function resendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->email_verified) {
            return response()->json(['message' => 'Email already verified'], 400);
        }

        // Generate new OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $otpExpiresAt = Carbon::now()->addMinutes(10);

        $user->email_verification_otp = $otp;
        $user->otp_expires_at = $otpExpiresAt;
        $user->save();

        // Send OTP via email
        try {
            Mail::to($user->email)->send(new SendOtpMail($otp, $user->name));
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send verification email. Please try again.'
            ], 500);
        }

        return response()->json([
            'message' => 'OTP has been resent to your email.',
        ], 200);
    }

    // Login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (! $token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = JWTAuth::user();

        // Check if email is verified
        if (!$user->email_verified) {
            return response()->json([
                'message' => 'Please verify your email first. Check your email for the verification code.',
                'email' => $user->email,
                'email_verified' => false,
            ], 403);
        }

        return response()->json([
            'message' => 'Login successful',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    // Get Profile
    public function profile()
    {
        $user = JWTAuth::parseToken()->authenticate();
        return response()->json($user);
    }

    // Logout
    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Successfully logged out']);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['message' => 'Failed to logout, please try again.'], 500);
        }
    }

    // Update Profile
    public function update(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $validator = Validator::make($request->all(), [
            'name'       => 'sometimes|string|max:255',
            'email'      => 'sometimes|email|unique:users,email,' . $user->id,
            'mobile'     => 'sometimes|string|min:10',
            'address'    => 'sometimes|string|max:255',
            'address1'   => 'sometimes|nullable|string',
            'address2'   => 'sometimes|nullable|string',
            'address3'   => 'sometimes|nullable|string',
            'address4'   => 'sometimes|nullable|string',
            'address5'   => 'sometimes|nullable|string',
            'default_address_index' => 'sometimes|integer|min:1|max:5',
            'pin'        => 'sometimes|string|max:10',
            'city'       => 'sometimes|string|max:50',
            'gst_number' => 'nullable|string|max:15',
            'image'      => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }
            $data['image'] = $request->file('image')->store('profile_images', 'public');
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user'    => $user,
        ]);
    }

    // Add to Wishlist
    public function addToWishlist(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $exists = Wishlist::where('user_id', $user->id)
                          ->where('product_id', $request->product_id)
                          ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already in wishlist'], 200);
        }

        $wishlist = Wishlist::create([
            'user_id'    => $user->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json(['message' => 'Added to wishlist', 'wishlist' => $wishlist]);
    }

    // Remove from Wishlist
    public function removeFromWishlist($productId)
    {
        $user = JWTAuth::parseToken()->authenticate();

        Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->delete();

        return response()->json(['message' => 'Removed from wishlist']);
    }

    // Get Wishlist
    public function wishlist()
    {
        $user = JWTAuth::parseToken()->authenticate();
        $items = Wishlist::with('product')->where('user_id', $user->id)->get();

        return response()->json($items);
    }

    // Optional: Get all users
    public function index()
    {
        return response()->json(User::all());
    }

    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }
}
