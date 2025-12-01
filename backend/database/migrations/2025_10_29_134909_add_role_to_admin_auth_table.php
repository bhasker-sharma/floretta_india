<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tableName = Schema::hasTable('admin_auth') ? 'admin_auth' : 'admins';

        Schema::table($tableName, function (Blueprint $table) use ($tableName) {
            if (!Schema::hasColumn($tableName, 'role')) {
                $table->string('role')->default('admin');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = Schema::hasTable('admin_auth') ? 'admin_auth' : 'admins';

        Schema::table($tableName, function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
