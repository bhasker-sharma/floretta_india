<?php
// Update admin password
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

$email = 'admin@floretta.in';
$password = Hash::make('Floretta@2025');

DB::table('admin_auth')
    ->where('email', $email)
    ->update(['password' => $password, 'updated_at' => now()]);

echo "Password updated for: $email\n";
echo "New password: Floretta@2025\n";
echo "Password hash length: " . strlen($password) . "\n";
