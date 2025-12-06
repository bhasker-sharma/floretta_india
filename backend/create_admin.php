<?php

use App\Models\AdminAuth;
use Illuminate\Support\Facades\Hash;

// Create default admin if none exists
if (AdminAuth::count() == 0) {
    AdminAuth::create([
        'email' => 'admin@floretta.com',
        'password' => Hash::make('Admin@123'),
        'role' => 'superadmin'
    ]);
    echo "Default admin created!\n";
    echo "Email: admin@floretta.com\n";
    echo "Password: Admin@123\n";
} else {
    echo "Admin already exists: " . AdminAuth::first()->email . "\n";
}
