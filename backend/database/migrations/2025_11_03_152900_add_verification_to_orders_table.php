<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Add verified_at if it doesn't exist
            if (!Schema::hasColumn('orders', 'verified_at')) {
                $table->timestamp('verified_at')->nullable();
            }

            // Add verified_by_admin_id if it doesn't exist
            if (!Schema::hasColumn('orders', 'verified_by_admin_id')) {
                $table->unsignedBigInteger('verified_by_admin_id')->nullable();

                // Determine correct admin table name
                $adminTable = Schema::hasTable('admin_auth') ? 'admin_auth' : 'admins';

                // Add foreign key to admin table if both tables/columns are present
                $table->foreign('verified_by_admin_id')
                    ->references('id')
                    ->on($adminTable)
                    ->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'verified_by_admin_id')) {
                // Drop FK then column
                $table->dropForeign(['verified_by_admin_id']);
                $table->dropColumn('verified_by_admin_id');
            }
            if (Schema::hasColumn('orders', 'verified_at')) {
                $table->dropColumn('verified_at');
            }
        });
    }
};
