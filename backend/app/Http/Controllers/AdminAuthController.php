<?php

namespace App\Http\Controllers;

use App\Models\AdminAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

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

        // Generate JWT token using the admin guard
        $token = auth('admin')->login($admin);

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
        auth('admin')->logout();

        return response()->json([
            'message' => 'Logout successful'
        ]);
    }

    /**
     * Get authenticated admin details
     */
    public function me()
    {
        $admin = auth('admin')->user();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'admin' => [
                'id' => $admin->id,
                'email' => $admin->email,
                'type' => 'admin',
                'role' => $admin->role ?? 'admin'
            ]
        ]);
    }

    /**
     * Create a new admin account (superadmin only)
     * SECURITY: Only superadmins can create new admin accounts
     */
    public function createAdmin(Request $request)
    {
        // SECURITY: Verify authenticated admin is superadmin
        $currentAdmin = auth('admin')->user();

        if (!$currentAdmin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized'
            ], 401);
        }

        if ($currentAdmin->role !== 'superadmin') {
            return response()->json([
                'success' => false,
                'error' => 'Forbidden - Superadmin access required'
            ], 403);
        }

        // Validate the request
        $request->validate([
            'email' => 'required|email|unique:admin_auth,email',
            'password' => 'required|min:6',
            'role' => 'nullable|in:admin,superadmin', // Optional role field
        ]);

        try {
            // Create new admin with hashed password
            $admin = AdminAuth::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role ?? 'admin', // Default to 'admin' role
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Admin created successfully',
                'admin' => [
                    'id' => $admin->id,
                    'email' => $admin->email,
                    'role' => $admin->role,
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
     * Get all admins (superadmin only, JWT protected)
     */
    public function getAllAdmins()
    {
        // Get authenticated admin from JWT
        $admin = auth('admin')->user();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized'
            ], 401);
        }

        // Verify admin is superadmin
        if ($admin->role !== 'superadmin') {
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
     * Get all orders for admin (JWT protected)
     */
    public function getAllOrders()
    {
        // Get authenticated admin from JWT
        $admin = auth('admin')->user();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'Admin authentication required'
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