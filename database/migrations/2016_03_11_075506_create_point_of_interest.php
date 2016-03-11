<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePointOfInterest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('point_of_interests', function (Blueprint $table) {
            $table->increments('id')->unsigned();
            $table->integer('type_id')->unsigned();
            $table->string('name');
            $table->string('title');
            $table->string('address')->nullable();
            $table->string('email')->nullable();
            $table->double('lat')->nullable();
            $table->double('lng')->nullable();
            $table->text('description')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('point_of_interests');
    }
}
