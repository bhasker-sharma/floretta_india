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
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('product_id');
            $table->integer('quantity');
            $table->timestamps();
            $table->string('name')->nullable();
            $table->string('scent')->nullable();
            $table->string('volume_ml')->nullable();
            $table->decimal('price', 8, 2)->nullable();
            $table->decimal('original_price', 8, 2)->nullable();
            $table->decimal('discount_amount', 8, 2)->nullable();
            $table->boolean('is_discount_active')->default(false);
            $table->decimal('delivery_charge', 8, 2)->nullable();
            $table->integer('available_quantity')->nullable();
            $table->float('rating')->nullable();
            $table->integer('reviews_count')->nullable();
            $table->string('image_path')->nullable();
            $table->string('flag')->nullable();
            $table->text('discription')->nullable();
            $table->text('about_product')->nullable();
            $table->json('extra_images')->nullable();
            $table->text('ingridiance')->nullable();
            $table->decimal('profit', 8, 2)->nullable();
            $table->string('colour')->nullable();
            $table->string('brand')->nullable();
            $table->string('item_form')->nullable();
            $table->string('power_source')->nullable();
            $table->text('about')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
