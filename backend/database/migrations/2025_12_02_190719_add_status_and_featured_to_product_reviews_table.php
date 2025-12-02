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
        Schema::table('product_reviews', function (Blueprint $table) {
            // Add status column if it doesn't exist
            if (!Schema::hasColumn('product_reviews', 'status')) {
                $table->enum('status', ['pending', 'approved', 'rejected'])
                    ->default('pending')
                    ->after('verified_purchase')
                    ->comment('Review approval status');

                $table->index('status');
            }

            // Add is_featured column if it doesn't exist
            if (!Schema::hasColumn('product_reviews', 'is_featured')) {
                $table->boolean('is_featured')
                    ->default(false)
                    ->after('status')
                    ->comment('Whether this review is featured on homepage');

                $table->index('is_featured');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_reviews', function (Blueprint $table) {
            if (Schema::hasColumn('product_reviews', 'status')) {
                $table->dropIndex(['status']);
                $table->dropColumn('status');
            }

            if (Schema::hasColumn('product_reviews', 'is_featured')) {
                $table->dropIndex(['is_featured']);
                $table->dropColumn('is_featured');
            }
        });
    }
};
