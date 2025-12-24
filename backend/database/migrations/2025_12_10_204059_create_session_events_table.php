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
        Schema::create('session_events', function (Blueprint $table) {
            $table->id();
            $table->string('session_id');           // unique session ID
            $table->string('event');                // event type: page_view, click
            $table->string('page')->nullable();     // page URL
            $table->json('metadata')->nullable();   // extra data (product_id, device, etc.)
            $table->timestamps();                   // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('session_events');
    }
};