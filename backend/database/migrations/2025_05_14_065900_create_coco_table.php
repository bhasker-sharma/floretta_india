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
    Schema::create('coco', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('brand', 100);
        $table->decimal('price', 10, 2);
        $table->decimal('old_price', 10, 2)->nullable();
        $table->string('size', 50)->nullable();
        $table->integer('savings')->nullable();
        $table->string('main_image')->nullable();
        $table->string('image_2')->nullable();
        $table->string('image_3')->nullable();
        $table->string('image_4')->nullable();
        $table->timestamps(); // Laravel-style created_at and updated_at
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coco');
    }
};
