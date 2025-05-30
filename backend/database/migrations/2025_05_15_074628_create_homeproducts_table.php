// database/migrations/xxxx_xx_xx_create_homeproducts_table.php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHomeproductsTable extends Migration
{
    public function up()
    {
        Schema::create('homeproducts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('image');
            $table->string('image_hover');
            $table->decimal('price', 8, 2);
            $table->decimal('old_price', 8, 2);
            $table->decimal('rating', 3, 2);
            $table->integer('reviews')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('homeproducts');
    }
}
