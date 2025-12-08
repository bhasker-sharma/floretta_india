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
        // role is now added in the create_admins_table migration (creates admin_auth table)
        // This migration is kept for backwards compatibility but does nothing
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
