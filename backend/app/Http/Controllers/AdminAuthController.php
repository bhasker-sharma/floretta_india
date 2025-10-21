<?php

namespace App\Http\Controllers;

use App\Models\AdminAuth;
use Illuminate\Http\Request;
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
    public function logout()
    {
        return response()->json([
            'message' => 'Logout successful'
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
        list($adminId, $timestamp) = explode(':', $decoded, 2);

        // Verify admin exists in admin_auth table
        $admin = AdminAuth::find($adminId);

        if (!$admin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'Admin not found'
            ], 401);
        }

        // Fetch all orders with user relationship
        $orders = \App\Models\Order::with('user:id,name,email')
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