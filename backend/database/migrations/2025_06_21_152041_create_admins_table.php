<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   // database/migrations/xxxx_xx_xx_create_admins_table.php
public function up()
{
    Schema::create('admin_auth', function (Blueprint $table) {
        $table->id();
        $table->string('name')->nullable();
        $table->string('email')->unique();
        $table->string('password');
        $table->string('role')->default('admin');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_auth');
    }
};
