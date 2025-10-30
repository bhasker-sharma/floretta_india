<?php

namespace App\Http\Controllers;

use App\Models\AdminAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    /**
     * Handle admin login (all admins are stored in database with hashed passwords)
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Check database for admin
        $admin = AdminAuth::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create a simple token
        $token = base64_encode($admin->id . ':' . time());

        return response()->json([
            'message' => 'Login successful',
            'admin' => [
                'id' => $admin->id,
                'email' => $admin->email,
                'type' => 'admin',
                'role' => $admin->role ?? 'admin'
            ],
            'token' => $token,
        ]);
    }

    /**
     * Handle admin logout
     */
    public function logout()
    {
        return response()->json([
            'message' => 'Logout successful'
        ]);
    }

    /**
     * Create a new admin account
     */
    public function createAdmin(Request $request)
    {
        // Validate the request
        $request->validate([
            'email' => 'required|email|unique:admin_auth,email',
            'password' => 'required|min:6',
        ]);

        try {
            // Create new admin with hashed password
            $admin = AdminAuth::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Admin created successfully',
                'admin' => [
                    'id' => $admin->id,
                    'email' => $admin->email,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create admin',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all admins (superadmin only)
     */
    public function getAllAdmins(Request $request)
    {
        // Verify admin token
        $token = $request->header('Authorization');

        if (!$token || !str_starts_with($token, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized'
            ], 401);
        }

        // Extract and decode token
        $tokenValue = substr($token, 7);
        $decoded = base64_decode($tokenValue);

        if (!$decoded || !str_contains($decoded, ':')) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid Token'
            ], 401);
        }

        // Extract admin ID from token
        list($adminId) = explode(':', $decoded, 2);

        // Verify admin exists and is superadmin
        $admin = AdminAuth::find($adminId);

        if (!$admin || $admin->role !== 'superadmin') {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized - Superadmin access required'
            ], 403);
        }

        // Fetch all admins
        $admins = AdminAuth::select('id', 'email', 'role', 'created_at')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'admins' => $admins
        ]);
    }

    /**
     * Get all orders for admin
     */
    public function getAllOrders(Request $request)
    {
        // Verify admin token
        $token = $request->header('Authorization');

        if (!$token || !str_starts_with($token, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'Admin authentication required'
            ], 401);
        }

        // Extract and decode token
        $tokenValue = substr($token, 7); // Remove "Bearer " prefix
        $decoded = base64_decode($tokenValue);

        if (!$decoded || !str_contains($decoded, ':')) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid Token',
                'message' => 'Invalid admin token format'
            ], 401);
        }

        // Extract admin ID from token
        list($adminId) = explode(':', $decoded, 2);

        // Verify admin exists in admin_auth table
        $admin = AdminAuth::find($adminId);

        if (!$admin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'Admin not found'
            ], 401);
        }

        // Fetch all orders with user relationship including gst_number
        $orders = \App\Models\Order::with('user:id,name,email,gst_number')
            ->orderBy('created_at', 'desc')
            ->get();

        // Enrich order items with product images
        $orders->each(function ($order) {
            if ($order->order_items && is_array($order->order_items)) {
                $enrichedItems = [];
                foreach ($order->order_items as $item) {
                    if (isset($item['id'])) {
                        $product = \App\Models\productpage\Product::find($item['id']);
                        if ($product) {
                            $item['image'] = $product->image ?? null;
                        }
                    }
                    $enrichedItems[] = $item;
                }
                $order->order_items = $enrichedItems;
            }
        });

        return response()->json([
            'success' => true,
            'orders' => $orders
        ]);
    }
 }