<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdminAuth;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * All admin passwords are now hashed using bcrypt for security.
     * The hardcoded super admin has been removed - all admins are now in the database.
     */
    public function run(): void
    {
        // Super Admin - Main admin account with full access
        AdminAuth::firstOrCreate(
            ['email' => 'sukumaran@gmail.com'],
            [
                'password' => Hash::make('sukumaran@gmail.com'),
                'role' => 'superadmin'
            ]
        );

    }
}
