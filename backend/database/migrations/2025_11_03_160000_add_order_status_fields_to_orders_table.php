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
        // order_status and order_status_changed_at are now added in the create_orders_table migration
        // This migration is kept for backwards compatibility but does nothing
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
