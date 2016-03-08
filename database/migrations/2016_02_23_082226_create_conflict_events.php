<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateConflictEvents extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
          Schema::create('conflict_events', function(Blueprint $table){
            $table->increments('id');
            $table->string('title');
            $table->integer('type_id')->unsigned();
            $table->integer('year')->unsigned();
            $table->integer('int2014')->unsigned();
            $table->integer('int2015')->unsigned();
            $table->integer('territory')->unsigned();
            $table->integer('secession')->unsigned();
            $table->integer('system')->unsigned();
            $table->integer('national_power')->unsigned();
            $table->integer('subnational_predominance')->unsigned();
            $table->integer('international_power')->unsigned();
            $table->integer('resources')->unsigned();
            $table->integer('other')->unsigned();
            $table->text('text')->nullable();
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
          Schema::drop('conflict_events');
    }
}
