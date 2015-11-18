<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsgroupFieldToDataIndizes extends Migration
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
          $table->boolean('is_group')->default(0);
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
          $table->dropColumn('is_group');
        });
    }
}
