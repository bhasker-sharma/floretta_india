<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('products', function (Blueprint $table) {
            $table->string('tagline')->nullable()->after('slug');
            $table->longText('description')->nullable()->after('tagline');
            $table->text('ingredients')->nullable()->change();
            $table->text('how_to_use')->nullable()->change();
            $table->boolean('is_featured')->default(false)->after('is_active');
            $table->string('meta_title')->nullable()->after('is_featured');
            $table->text('meta_description')->nullable()->after('meta_title');
        });
    }

    public function down(): void {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['tagline', 'description', 'is_featured', 'meta_title', 'meta_description']);
        });
    }
};
