<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing sliders based on their image names and flag

        // Slides 1-5 (slide1.png to slide5.png) -> Products page
        DB::table('sliders')
            ->whereIn('image', [
                'slider/slide1.png',
                'slider/slide2.png',
                'slider/slide3.png',
                'slider/slide4.png',
                'slider/slide5.png',
            ])
            ->update([
                'page' => 'products',
                'order' => DB::raw('id - 1'), // Set order based on ID
            ]);

        // Slides 6-10 (slide6.png to slide10.png) -> Live Perfume Bar page
        DB::table('sliders')
            ->whereIn('image', [
                'slider/slide6.png',
                'slider/slide7.png',
                'slider/slide8.png',
                'slider/slide9.png',
                'slider/slide10.png',
            ])
            ->update([
                'page' => 'liveperfume',
                'order' => DB::raw('id - 6'), // Set order 0-4
            ]);

        // Slides 11-15 (slide11.png to slide15.png) with flag='hotel' -> Hotel Amenities page
        DB::table('sliders')
            ->whereIn('image', [
                'slider/slide11.png',
                'slider/slide12.png',
                'slider/slide13.png',
                'slider/slide14.png',
                'slider/slide15.png',
            ])
            ->update([
                'page' => 'hotelamenities',
                'order' => DB::raw('id - 11'), // Set order 0-4
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert all sliders back to 'home' page
        DB::table('sliders')->update(['page' => 'home', 'order' => 0]);
    }
};
