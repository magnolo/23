<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserdataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('23_userdata', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            //$table->foreign('user_id')->references('id')->on('users');
            $table->integer('dataprovider_id')->unsigned()->default(0);
            //$table->foreign('dataprovider_id')->references('id')->on('23_dataproviders');
            $table->string('table_name');
            $table->string('iso_name');
            $table->json('meta_data');
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false);
            $table->boolean('is_api')->default(false);
            $table->softDeletes();
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
        Schema::drop('23_userdata');
    }
}
