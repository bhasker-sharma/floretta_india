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
            $table->text('description');
            $table->decimal('price', 8, 2);
            $table->decimal('old_price', 8, 2)->nullable(); // optional
            $table->string('main_image');
            $table->json('extra_images'); // store multiple image URLs
            $table->text('features');
            $table->text('ingredients');
            $table->decimal('profit', 8, 2);
            $table->date('launch_date');

            // New columns
            $table->string('scent')->nullable();
            $table->string('colour')->nullable();
            $table->string('brand')->nullable();
            $table->string('item_form')->nullable();
            $table->string('power_source')->nullable();
            $table->text('about')->nullable();

            $table->timestamps();
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
