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
        // Credentials are read from .env file for security
        $email = env('SUPER_ADMIN_EMAIL');
        $password = env('SUPER_ADMIN_PASSWORD');

        if (!$email || !$password) {
            $this->command->error('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env file');
            return;
        }

        AdminAuth::firstOrCreate(
            ['email' => $email],
            [
                'password' => Hash::make($password),
                'role' => 'superadmin'
            ]
        );

        $this->command->info('Super admin created/verified successfully');
        $this->command->warn('IMPORTANT: You can now remove SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD from .env for security');
    }
}
