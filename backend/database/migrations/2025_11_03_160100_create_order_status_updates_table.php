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
        if (!Schema::hasTable('order_status_updates')) {
            Schema::create('order_status_updates', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('order_id');
                $table->string('from_status')->nullable();
                $table->string('to_status');
                $table->unsignedBigInteger('changed_by_admin_id')->nullable();
                $table->text('note')->nullable();
                $table->timestamps();

                $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
                $table->foreign('changed_by_admin_id')->references('id')->on('admin_auth')->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('order_status_updates')) {
            Schema::dropIfExists('order_status_updates');
        }
    }
};
