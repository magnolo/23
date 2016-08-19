<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAutonomyToConflictEvents extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('conflict_events', function (Blueprint $table) {
            //
            $table->integer('autonomy')->unsigned()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('conflict_events', function (Blueprint $table) {
            //
          $table->dropColumn(['autonomy']);
        });
    }
}
