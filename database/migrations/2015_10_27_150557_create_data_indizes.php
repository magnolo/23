<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDataIndizes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('data_indizes', function(Blueprint $table){
            $table->increments('id');
            $table->string('title')->unique();
            $table->string('full_name');
            $table->string('table');
            $table->string('score_field_name');
            $table->string('change_field_name')->nullable();
            $table->string('order_field')->default('year');
            $table->string('countries_id_field')->nullable();
            $table->string('countries_iso_field');
            $table->string('color')->nullable();
            $table->string('icon')->nullable();
            $table->string('description')->nullable();
            $table->string('caption')->nullable();
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
        Schema::drop('data_indizes');
    }
}
