<?php

namespace App\Http\Controllers;

use App\Models\AdminAuth;
use App\Rules\StrongPassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AdminAuthController extends Controller
{
    private array $allowedStatuses = ['Order Placed', 'Shipped', 'In-Transit', 'Delivered'];
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
                'role' => $admin->role ?? 'admin',
                'permissions' => $admin->permissions ?? []
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
                'role' => $admin->role ?? 'admin',
                'permissions' => $admin->permissions ?? []
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
            'password' => ['required', new StrongPassword()],
            'role' => 'nullable|in:admin,superadmin', // Optional role field
            'permissions' => 'nullable|array', // Optional permissions array
            'permissions.*' => 'string|in:orders,customers,products,analytics,add_user,enquiries,reviews,career,settings',
        ]);

        try {
            // Default permissions for regular admin
            $defaultPermissions = ['orders', 'customers', 'products', 'analytics', 'enquiries', 'reviews', 'career', 'settings'];
            
            // Create new admin with hashed password
            $admin = AdminAuth::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role ?? 'admin', // Default to 'admin' role
                'permissions' => $request->permissions ?? $defaultPermissions,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Admin created successfully',
                'admin' => [
                    'id' => $admin->id,
                    'email' => $admin->email,
                    'role' => $admin->role,
                    'permissions' => $admin->permissions,
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
        $admins = AdminAuth::select('id', 'email', 'role', 'permissions', 'created_at')->orderBy('created_at', 'desc')->get();

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

        // Enrich order items with product images (defensive)
        $orders->each(function ($order) {
            try {
                $items = $order->order_items;
                if (is_string($items)) {
                    $decoded = json_decode($items, true);
                    $items = is_array($decoded) ? $decoded : [];
                }
                if (is_array($items)) {
                    $enrichedItems = [];
                    foreach ($items as $item) {
                        if (isset($item['id']) && class_exists(\App\Models\productpage\Product::class)) {
                            $product = \App\Models\productpage\Product::find($item['id']);
                            if ($product) {
                                $item['image'] = $product->image ?? null;
                            }
                        }
                        $enrichedItems[] = $item;
                    }
                    $order->order_items = $enrichedItems;
                }
            } catch (\Throwable $e) {
                Log::warning('Order items enrichment failed (all orders)', ['order_id' => $order->id, 'error' => $e->getMessage()]);
            }
        });

        return response()->json([
            'success' => true,
            'orders' => $orders
        ]);
    }

    /**
     * Delete an admin account (superadmin only, JWT protected)
     */
    public function deleteAdmin($id)
    {
        // Get authenticated admin from JWT
        $currentAdmin = auth('admin')->user();

        if (!$currentAdmin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized'
            ], 401);
        }

        // Verify current admin is superadmin
        if ($currentAdmin->role !== 'superadmin') {
            return response()->json([
                'success' => false,
                'error' => 'Forbidden - Superadmin access required'
            ], 403);
        }

        // Find the admin to delete
        $adminToDelete = AdminAuth::find($id);

        if (!$adminToDelete) {
            return response()->json([
                'success' => false,
                'error' => 'Admin not found'
            ], 404);
        }

        // Prevent deleting yourself
        if ($adminToDelete->id === $currentAdmin->id) {
            return response()->json([
                'success' => false,
                'error' => 'You cannot delete your own account'
            ], 400);
        }

        // Prevent deleting the last superadmin
        if ($adminToDelete->role === 'superadmin') {
            $superadminCount = AdminAuth::where('role', 'superadmin')->count();
            if ($superadminCount <= 1) {
                return response()->json([
                    'success' => false,
                    'error' => 'Cannot delete the last superadmin account'
                ], 400);
            }
        }

        try {
            $adminToDelete->delete();

            return response()->json([
                'success' => true,
                'message' => 'Admin deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete admin',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update admin permissions (superadmin only, JWT protected)
     */
    public function updateAdminPermissions(Request $request, $id)
    {
        // Get authenticated admin from JWT
        $currentAdmin = auth('admin')->user();

        if (!$currentAdmin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized'
            ], 401);
        }

        // Verify current admin is superadmin
        if ($currentAdmin->role !== 'superadmin') {
            return response()->json([
                'success' => false,
                'error' => 'Forbidden - Superadmin access required'
            ], 403);
        }

        // Validate the request
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'string|in:orders,customers,products,analytics,add_user,enquiries,reviews,career,settings',
        ]);

        // Find the admin to update
        $adminToUpdate = AdminAuth::find($id);

        if (!$adminToUpdate) {
            return response()->json([
                'success' => false,
                'error' => 'Admin not found'
            ], 404);
        }

        // Don't allow editing superadmin permissions
        if ($adminToUpdate->role === 'superadmin') {
            return response()->json([
                'success' => false,
                'error' => 'Cannot edit superadmin permissions'
            ], 400);
        }

        try {
            $adminToUpdate->permissions = $request->permissions;
            $adminToUpdate->save();

            return response()->json([
                'success' => true,
                'message' => 'Permissions updated successfully',
                'admin' => [
                    'id' => $adminToUpdate->id,
                    'email' => $adminToUpdate->email,
                    'role' => $adminToUpdate->role,
                    'permissions' => $adminToUpdate->permissions,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to update permissions',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all users/customers (admin only, JWT protected)
     */
    public function getAllUsers()
    {
        // Get authenticated admin from JWT
        $currentAdmin = auth('admin')->user();

        if (!$currentAdmin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized'
            ], 401);
        }

        try {
            $users = \App\Models\User::select(
                'id', 'name', 'email', 'mobile', 'gst_number',
                'address', 'address1', 'address2', 'address3', 'address4', 'address5',
                'city', 'pin', 'created_at'
            )
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'users' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch users',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get only NEW (unverified) orders
     */
    public function getNewOrders()
    {
        $admin = auth('admin')->user();
        if (!$admin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'Admin authentication required'
            ], 401);
        }

        $orders = \App\Models\Order::with('user:id,name,email,gst_number')
            ->whereNull('verified_at')
            ->orderBy('created_at', 'desc')
            ->get();

        $orders->each(function ($order) {
            try {
                $items = $order->order_items;
                if (is_string($items)) {
                    $decoded = json_decode($items, true);
                    $items = is_array($decoded) ? $decoded : [];
                }
                if (is_array($items)) {
                    $enrichedItems = [];
                    foreach ($items as $item) {
                        if (isset($item['id']) && class_exists(\App\Models\productpage\Product::class)) {
                            $product = \App\Models\productpage\Product::find($item['id']);
                            if ($product) {
                                $item['image'] = $product->image ?? null;
                            }
                        }
                        $enrichedItems[] = $item;
                    }
                    $order->order_items = $enrichedItems;
                }
            } catch (\Throwable $e) {
                Log::warning('Order items enrichment failed (new orders)', ['order_id' => $order->id, 'error' => $e->getMessage()]);
            }
        });

        return response()->json([
            'success' => true,
            'orders' => $orders
        ]);
    }

    /**
     * Verify an order (idempotent). Marks verified_at and verified_by_admin_id
     */
    public function verifyOrder($orderId)
    {
        $admin = auth('admin')->user();
        if (!$admin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'Admin authentication required'
            ], 401);
        }

        $order = \App\Models\Order::find($orderId);
        if (!$order) {
            return response()->json([
                'success' => false,
                'error' => 'Order not found'
            ], 404);
        }

        // If already verified, return current state (idempotent)
        if ($order->verified_at) {
            return response()->json([
                'success' => true,
                'message' => 'Order already verified',
                'order' => $order
            ]);
        }

        $order->verified_at = now();
        $order->verified_by_admin_id = $admin->id;
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Order verified successfully',
            'order' => $order
        ]);
    }

    /**
     * Update order status (Admin only) and record history
     */
    public function updateOrderStatus(Request $request, $orderId)
    {
        $admin = auth('admin')->user();
        if (!$admin) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'Admin authentication required'
            ], 401);
        }

        $data = $request->validate([
            'status' => 'required|string',
        ]);

        $newStatus = trim($data['status']);
        if (!in_array($newStatus, $this->allowedStatuses, true)) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid status',
                'allowed' => $this->allowedStatuses,
            ], 422);
        }

        $order = \App\Models\Order::find($orderId);
        if (!$order) {
            return response()->json([
                'success' => false,
                'error' => 'Order not found'
            ], 404);
        }

        if ($order->order_status === $newStatus) {
            return response()->json([
                'success' => true,
                'message' => 'No change',
                'order' => $order,
            ]);
        }

        try {
            DB::transaction(function () use ($order, $newStatus, $admin) {
                $from = $order->order_status ?? null;
                $order->order_status = $newStatus;
                $order->order_status_changed_at = now();
                $order->save();

                // Write status history if table exists; don't fail the request if it doesn't
                try {
                    if (Schema::hasTable('order_status_updates')) {
                        \App\Models\OrderStatusUpdate::create([
                            'order_id' => $order->id,
                            'from_status' => $from,
                            'to_status' => $newStatus,
                            'changed_by_admin_id' => $admin->id,
                            'note' => null,
                        ]);
                    } else {
                        Log::warning('order_status_updates table missing; skipping history insert', [
                            'order_id' => $order->id,
                            'admin_id' => $admin->id,
                            'from' => $from,
                            'to' => $newStatus,
                        ]);
                    }
                } catch (\Throwable $ex) {
                    Log::warning('Failed to insert order status history row', [
                        'order_id' => $order->id,
                        'admin_id' => $admin->id,
                        'from' => $from,
                        'to' => $newStatus,
                        'error' => $ex->getMessage(),
                    ]);
                }
            });
        } catch (\Throwable $e) {
            Log::error('Failed to update order status', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'error' => 'Failed to update order status'
            ], 500);
        }

        $order->refresh();
        return response()->json([
            'success' => true,
            'message' => 'Order status updated',
            'order' => $order,
        ]);
    }
}