<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('status',['pending','confirmed','processing','shipped','delivered','cancelled'])->default('pending');
            $table->enum('payment_status',['pending','paid','failed','refunded'])->default('pending');
            $table->enum('payment_method',['razorpay','cod'])->default('razorpay');
            $table->string('razorpay_order_id')->nullable();
            $table->string('razorpay_payment_id')->nullable();
            $table->string('razorpay_signature')->nullable();
            $table->integer('subtotal');
            $table->integer('shipping_charge')->default(0);
            $table->integer('total');
            $table->json('shipping_address');
            $table->json('items');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('orders'); }
};