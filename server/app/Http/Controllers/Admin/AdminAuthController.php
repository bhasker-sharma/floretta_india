<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminAuthController extends Controller
{
    public function login(Request $r)
    {
        $v = Validator::make($r->all(), ['email' => 'required|email', 'password' => 'required']);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $admin = Admin::where('email', $r->email)->first();
        if (!$admin || !Hash::check($r->password, $admin->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        $token = auth('admin')->login($admin);
        return response()->json(['token' => $token, 'admin' => $admin]);
    }

    public function logout()
    {
        auth('admin')->logout();
        return response()->json(['message' => 'Logged out.']);
    }

    public function me()
    {
        return response()->json(auth('admin')->user());
    }

    public function createAdmin(Request $r)
    {
        $admin = auth('admin')->user();
        if ($admin->role !== 'super') return response()->json(['message' => 'Forbidden.'], 403);

        $v = Validator::make($r->all(), [
            'name'     => 'required|string',
            'email'    => 'required|email|unique:admins',
            'password' => 'required|min:8',
            'role'     => 'required|in:super,editor,support',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $newAdmin = Admin::create([
            'name'        => $r->name,
            'email'       => $r->email,
            'password'    => Hash::make($r->password),
            'role'        => $r->role,
            'permissions' => $r->input('permissions', []),
        ]);

        return response()->json($newAdmin, 201);
    }

    public function updatePermissions(Request $r, $id)
    {
        if (auth('admin')->user()->role !== 'super') return response()->json(['message' => 'Forbidden.'], 403);
        $target = Admin::findOrFail($id);
        $target->update(['permissions' => $r->input('permissions', []), 'role' => $r->input('role', $target->role)]);
        return response()->json($target->fresh());
    }

    public function deleteAdmin($id)
    {
        if (auth('admin')->user()->role !== 'super') return response()->json(['message' => 'Forbidden.'], 403);
        Admin::findOrFail($id)->delete();
        return response()->json(['message' => 'Admin deleted.']);
    }
}