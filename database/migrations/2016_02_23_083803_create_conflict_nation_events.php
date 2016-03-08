<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateConflictNationEvents extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
          Schema::create('conflict_nation_events', function(Blueprint $table){
            $table->increments('id');
            $table->integer('conflict_nation_id');
            $table->integer('conflict_event_id');
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
          Schema::drop('conflict_nation_events');
    }
}
