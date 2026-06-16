<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('sliders', function (Blueprint $table) {
            $table->id();
            $table->enum('page',['home','shop','coming_soon'])->default('home');
            $table->string('image_url');
            $table->string('alt_text')->nullable();
            $table->string('link_url')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('sliders'); }
};