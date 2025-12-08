<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        // user_id is now added in the create_carts_table migration
        // This migration is kept for backwards compatibility but does nothing
    }


    public function down()
    {
        // Nothing to do since user_id is part of the initial table creation
    }

};
