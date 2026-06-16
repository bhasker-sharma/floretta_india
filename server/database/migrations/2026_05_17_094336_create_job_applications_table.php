<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vacancy_id')->nullable()->constrained('job_vacancies')->nullOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone', 15)->nullable();
            $table->text('cover_letter_text')->nullable();
            $table->string('resume_path')->nullable();
            $table->enum('status',['new','reviewing','shortlisted','rejected'])->default('new');
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('job_applications'); }
};