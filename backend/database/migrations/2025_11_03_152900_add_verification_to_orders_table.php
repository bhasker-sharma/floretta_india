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
                $table->timestamp('verified_at')->nullable()->after('include_gst');
            }

            // Add verified_by_admin_id if it doesn't exist
            if (!Schema::hasColumn('orders', 'verified_by_admin_id')) {
                $table->unsignedBigInteger('verified_by_admin_id')->nullable()->after('verified_at');

                // Add foreign key to admin_auth table if both tables/columns are present
                $table->foreign('verified_by_admin_id')
                    ->references('id')
                    ->on('admin_auth')
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
