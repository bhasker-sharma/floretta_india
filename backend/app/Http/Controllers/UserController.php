<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wishlist;
use App\Rules\StrongPassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    // Register
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

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'mobile'   => $validated['mobile'],
            'address'  => $validated['address'] ?? null,
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'User registered successfully',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    // Login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (! $token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'user'    => JWTAuth::user(),
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
            'address1'   => 'sometimes|string|max:255',
            'address2'   => 'sometimes|string|max:255',
            'address3'   => 'sometimes|string|max:255',
            'address4'   => 'sometimes|string|max:255',
            'address5'   => 'sometimes|string|max:255',
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
