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
            $table->decimal('original_price', 8, 2)->nullable();
            $table->decimal('discount_amount', 8, 2)->nullable();
            $table->boolean('is_discount_active')->default(false);
            $table->decimal('delivery_charge', 8, 2)->default(0.00);
            $table->integer('available_quantity')->default(0);
            $table->decimal('rating', 3, 1)->default(0.0);
            $table->integer('reviews_count')->default(0);
            $table->string('image_path');
            $table->string('flag'); // freshner or face_mist
            $table->timestamps();
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
