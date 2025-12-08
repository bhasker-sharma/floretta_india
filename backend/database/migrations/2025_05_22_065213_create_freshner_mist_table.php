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
        Schema::create('freshner_mist', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('scent')->nullable();
            $table->integer('volume_ml');
            $table->decimal('price', 8, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->decimal('discount_amount', 10, 2)->nullable();
            $table->boolean('is_discount_active')->default(false);
            $table->decimal('delivery_charge', 10, 2)->default(0.00);
            $table->integer('available_quantity')->default(0);
            $table->decimal('rating', 3, 1);
            $table->integer('reviews_count');
            $table->string('image_path');
            $table->string('flag');
            $table->timestamps();
            $table->text('discription')->nullable();
            $table->text('about_product')->nullable();
            $table->longText('extra_images')->nullable();
            $table->text('ingridiance')->nullable();
            $table->decimal('profit', 10, 2)->nullable();
            $table->string('colour', 100)->nullable();
            $table->string('brand', 100)->nullable();
            $table->string('item_form', 100)->nullable();
            $table->string('power_source', 100)->nullable();
            $table->text('about')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('freshner_mist');
    }
};
