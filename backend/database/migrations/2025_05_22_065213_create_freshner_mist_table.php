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
        $table->decimal('rating', 3, 1);
        $table->integer('reviews_count');
        $table->string('image_path');
        $table->string('flag'); // freshner or face_mist
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('freshner_mist');
}

};
