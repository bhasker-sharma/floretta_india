<?php

// database/migrations/xxxx_xx_xx_create_contacts_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('hotel_name');
            $table->string('email');
            $table->string('mobile');
            $table->string('packaging_option');
            $table->string('preferred_fragrance');
            $table->string('estimated_quantity');
            $table->text('additional_requirements')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('contacts');
    }
};
