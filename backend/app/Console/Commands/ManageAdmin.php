<?php

namespace App\Console\Commands;

use App\Models\Admin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class ManageAdmin extends Command
{
    protected $signature = 'admin:manage {action} {email?} {--password=}';
    protected $description = 'Manage admin users (create, update, delete)';

    public function handle()
    {
        $action = $this->argument('action');
        $email = $this->argument('email');

        switch ($action) {
            case 'create':
                if (!$email) {
                    $email = $this->ask('Enter admin email:');
                }
                $password = $this->option('password') ?: $this->secret('Enter admin password:');
                
                Admin::create([
                    'email' => $email,
                    'password' => Hash::make($password)
                ]);
                $this->info("Admin created successfully!");
                break;

            case 'update-password':
                if (!$email) {
                    $email = $this->ask('Enter admin email:');
                }
                $password = $this->option('password') ?: $this->secret('Enter new password:');
                
                $admin = Admin::where('email', $email)->first();
                if ($admin) {
                    $admin->update(['password' => Hash::make($password)]);
                    $this->info("Password updated successfully!");
                } else {
                    $this->error("Admin not found!");
                }
                break;

            case 'delete':
                if (!$email) {
                    $email = $this->ask('Enter admin email to delete:');
                }
                if ($this->confirm("Are you sure you want to delete admin: $email?")) {
                    $deleted = Admin::where('email', $email)->delete();
                    if ($deleted) {
                        $this->info("Admin deleted successfully!");
                    } else {
                        $this->error("Admin not found!");
                    }
                }
                break;

            case 'list':
                $admins = Admin::all(['id', 'email', 'created_at']);
                $this->table(
                    ['ID', 'Email', 'Created At'],
                    $admins->toArray()
                );
                break;

            default:
                $this->error("Invalid action! Use: create, update-password, delete, or list");
        }
    }
}
