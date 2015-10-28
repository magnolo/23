<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDataIndizesStructure extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('data_indizes_structures', function(Blueprint $table){
          $table->increments('id');
          $table->string('column_name');
          $table->string('title');
          $table->string('color')->nullable();
          $table->string('icon')->nullable();
          $table->integer('parent_id');
          $table->integer('data_indizes_id')->unsigned();
          $table->foreign('data_indizes_id')->references('id')->on('data_indizes');
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
        //
        Schema::drop('data_indizes_structures');
    }
}
