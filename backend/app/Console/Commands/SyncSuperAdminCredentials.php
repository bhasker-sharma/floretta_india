<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\AdminAuth;
use Illuminate\Support\Facades\Hash;

class SyncSuperAdminCredentials extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:sync-credentials';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync super admin credentials from .env to database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $envEmail = env('SUPER_ADMIN_EMAIL');
        $envPassword = env('SUPER_ADMIN_PASSWORD');

        // Validate .env credentials exist
        if (!$envEmail || !$envPassword) {
            $this->error('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env file');
            return Command::FAILURE;
        }

        // First, try to find admin by email from .env
        $admin = AdminAuth::where('email', $envEmail)->first();

        if (!$admin) {
            // If not found by email, try to find by superadmin role
            $admin = AdminAuth::where('role', 'superadmin')->first();

            if (!$admin) {
                // Create new super admin if doesn't exist
                $this->info('No super admin found. Creating new super admin...');
                $admin = AdminAuth::create([
                    'email' => $envEmail,
                    'password' => Hash::make($envPassword),
                    'role' => 'superadmin'
                ]);
                $this->info("✓ Super admin created successfully!");
                $this->info("  Email: {$envEmail}");
            } else {
                // Update existing superadmin email and password
                $this->info('Updating super admin credentials...');
                $oldEmail = $admin->email;

                $admin->email = $envEmail;
                $admin->password = Hash::make($envPassword);
                $admin->role = 'superadmin'; // Ensure role is set
                $admin->save();

                $this->info("✓ Super admin credentials updated successfully!");
                $this->info("  Old Email: {$oldEmail}");
                $this->info("  New Email: {$envEmail}");
            }
        } else {
            // Admin with this email already exists, just update password and role
            $this->info('Updating super admin password...');

            $admin->password = Hash::make($envPassword);
            $admin->role = 'superadmin'; // Ensure role is superadmin
            $admin->save();

            $this->info("✓ Super admin password updated successfully!");
            $this->info("  Email: {$envEmail}");
        }

        // Clear cache to ensure changes take effect
        $this->call('cache:clear');
        $this->call('config:clear');

        $this->info('');
        $this->info('Done! You can now login with:');
        $this->info("  Email: {$envEmail}");
        $this->info("  Password: (from .env)");

        return Command::SUCCESS;
    }
}
