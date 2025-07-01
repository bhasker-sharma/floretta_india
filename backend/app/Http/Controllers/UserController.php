<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class UserController extends Controller
{
    /**
     * 📩 Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
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

        // Auto-login after registration
        Auth::login($user);

        return response()->json([
            'message' => 'User registered successfully',
            'user'    => $user,
        ], 201);
    }

    /**
     * 🔐 Login a user via session (Sanctum-compatible)
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $credentials = $validator->validated();

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        Auth::login($user); // Uses session driver with Sanctum

        return response()->json([
            'message' => 'Login successful',
            'user'    => $user,
        ]);
    }

    /**
     * 🔐 Return the authenticated user's profile
     */
    public function profile(Request $request)
    {
        return response()->json([
            'status' => 'ok',
            'user'   => $request->user(),
        ]);
    }

    /**
     * ✅ Public test API to get first user
     */
    public function profilePublic()
    {
        $user = User::first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['user' => $user]);
    }

    /**
     * 📋 Get all registered users (for admin or reports)
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'mobile', 'address', 'created_at')->get();

        return response()->json(['users' => $users]);
    }

    /**
     * 👤 Get user by ID
     */
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['user' => $user]);
    }
}
