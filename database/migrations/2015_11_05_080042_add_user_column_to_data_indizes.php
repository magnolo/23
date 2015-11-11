<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUserColumnToDataIndizes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('data_indizes', function($table){
          $table->integer('weight')->nullable();
          $table->integer('user_id')->default(0);
        });

        Schema::create('user_data', function(Blueprint $table){
          $table->increments('id');
          $table->integer('user_id');
          $table->string('title');
          $table->string('name');
          $table->string('table_name');
          $table->json('meta_data');
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
        Schema::table('data_indizes', function($table){
          $table->dropColumn('weight');
          $table->dropColumn('user_id');
        });

        Schema::drop('user_data');
    }
}
