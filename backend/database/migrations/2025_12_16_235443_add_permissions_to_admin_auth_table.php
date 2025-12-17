<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('admin_auth', function (Blueprint $table) {
            $table->json('permissions')->nullable();
        });

        // Set default permissions for existing admins (all permissions)
        $defaultPermissions = [
            'orders',
            'customers',
            'products',
            'analytics',
            'add_user',
            'enquiries',
            'reviews',
            'career',
            'settings'
        ];

        DB::table('admin_auth')->update([
            'permissions' => json_encode($defaultPermissions)
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('admin_auth', function (Blueprint $table) {
            $table->dropColumn('permissions');
        });
    }
};
