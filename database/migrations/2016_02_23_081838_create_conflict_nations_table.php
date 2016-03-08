<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateConflictNationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('conflict_nations', function(Blueprint $table){
            $table->increments('id');
            $table->string('country');
            $table->string('iso', 3);
            $table->integer('intensity')->unsigned();
            $table->integer('territory')->unsigned()->nullable();
            $table->integer('secession')->unsigned()->nullable();
            $table->integer('system')->unsigned()->nullable();
            $table->integer('national_power')->unsigned()->nullable();
            $table->integer('subnational_predominance')->unsigned()->nullable();
            $table->integer('international_power')->unsigned()->nullable();
            $table->integer('resources')->unsigned()->nullable();
            $table->integer('other')->unsigned()->nullable();

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
        Schema::drop('conflict_nations');
    }
}
