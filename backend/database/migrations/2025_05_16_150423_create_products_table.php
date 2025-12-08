<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('volume_ml')->nullable();
            $table->string('Discription', 1000)->nullable();
            $table->decimal('price', 8, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->decimal('discount_amount', 10, 2)->nullable();
            $table->boolean('is_discount_active')->default(false);
            $table->boolean('is_bestseller')->default(false);
            $table->integer('bestseller_order')->nullable();
            $table->decimal('delivery_charge', 10, 2)->default(0.00);
            $table->integer('available_quantity')->default(0);
            $table->decimal('old_price', 8, 2)->nullable();
            $table->string('image');
            $table->string('flag', 50)->nullable();
            $table->string('about_product', 2000)->nullable();
            $table->decimal('rating', 3, 1);
            $table->integer('reviews_count')->default(0);
            $table->integer('reviews');
            $table->string('note', 500)->nullable();
            $table->timestamps();
            $table->text('features')->nullable();
            $table->json('extra_images')->nullable();
            $table->text('ingridiance')->nullable();
            $table->string('ingredients', 5000)->nullable();
            $table->text('profit')->nullable();
            $table->date('launch_date')->nullable();
            $table->string('scent', 100)->nullable();
            $table->string('colour')->nullable();
            $table->string('brand')->nullable();
            $table->string('item_form')->nullable();
            $table->string('power_source')->nullable();
            $table->longText('about')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
