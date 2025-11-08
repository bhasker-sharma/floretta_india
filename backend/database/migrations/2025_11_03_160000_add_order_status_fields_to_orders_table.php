<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'order_status')) {
                $table->string('order_status')->default('Order Placed')->after('status');
            }
            if (!Schema::hasColumn('orders', 'order_status_changed_at')) {
                $table->timestamp('order_status_changed_at')->nullable()->after('order_status');
            }
        });

        // Backfill existing rows
        DB::table('orders')->whereNull('order_status')->update([
            'order_status' => 'Order Placed',
            'order_status_changed_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'order_status_changed_at')) {
                $table->dropColumn('order_status_changed_at');
            }
            if (Schema::hasColumn('orders', 'order_status')) {
                $table->dropColumn('order_status');
            }
        });
    }
};
