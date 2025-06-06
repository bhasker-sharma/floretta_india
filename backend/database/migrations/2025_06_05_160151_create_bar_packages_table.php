<?php

// database/migrations/xxxx_xx_xx_create_bar_packages_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBarPackagesTable extends Migration
{
    public function up()
    {
        Schema::create('bar_packages', function (Blueprint $table) {
            $table->id();
            $table->integer('no_of_guests');
            $table->decimal('price', 10, 2);
            $table->enum('category', ['bronze', 'silver', 'gold']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bar_packages');
    }
}
