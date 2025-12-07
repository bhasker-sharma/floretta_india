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
        Schema::table('job_applications', function (Blueprint $table) {
            $table->enum('status', ['pending', 'shortlisted', 'interviewing', 'selected', 'rejected', 'offered'])
                  ->default('pending')
                  ->after('resume_path');
            $table->string('cover_letter_path')->nullable()->after('cover_letter');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropColumn(['status', 'cover_letter_path']);
        });
    }
};
