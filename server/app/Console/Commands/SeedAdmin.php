<?php

namespace App\Console\Commands;

use App\Models\Admin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class SeedAdmin extends Command
{
    protected $signature   = 'admin:seed';
    protected $description = 'Create or update the super admin from .env credentials (ADMIN_EMAIL / ADMIN_PASSWORD)';

    public function handle(): int
    {
        $email    = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (!$email || !$password) {
            $this->error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
            return 1;
        }

        $admin = Admin::updateOrCreate(
            ['email' => $email],
            [
                'name'        => 'Floretta Admin',
                'password'    => Hash::make($password),
                'role'        => 'super',
                'permissions' => [],
            ]
        );

        $this->info("Super admin " . ($admin->wasRecentlyCreated ? 'created' : 'updated') . ": {$email}");
        $this->line('Password is hashed in the database. You can now remove ADMIN_PASSWORD from .env if desired.');

        return 0;
    }
}
