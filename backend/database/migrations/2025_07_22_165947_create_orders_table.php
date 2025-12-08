<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 20)->unique()->nullable();
            $table->unsignedBigInteger('user_id');
            $table->string('razorpay_order_id');
            $table->string('razorpay_payment_id');
            $table->string('status');
            $table->string('order_status')->default('Order Placed');
            $table->timestamp('order_status_changed_at')->nullable();
            $table->timestamps();
            $table->string('customer_name')->nullable();
            $table->string('customer_email')->nullable();
            $table->string('customer_phone')->nullable();
            $table->text('customer_address')->nullable();
            $table->decimal('order_value', 10, 2)->nullable();
            $table->integer('order_quantity')->nullable();
            $table->json('order_items')->nullable();
            $table->boolean('include_gst')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->unsignedInteger('verified_by_admin_id')->nullable();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
