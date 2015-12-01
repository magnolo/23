<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIndicatorCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('23_indicator_categories', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('indicator_id')->unsigned();
            //$table->foreign('indicator_id')->references('id')->on('23_indicators');
            $table->integer('categorie_id')->unsigned();
            //$table->foreign('categorie_id')->references('id')->on('23_categories');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('23_indicator_categories');
    }
}
