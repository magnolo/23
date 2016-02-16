<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeWeightToDoubleValue extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"23_items"', function (Blueprint $table) {
            //
            $table->float('weight')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('"23_items"', function (Blueprint $table) {
            //
              $table->integer('weight')->nullable()->change();
        });
    }
}
