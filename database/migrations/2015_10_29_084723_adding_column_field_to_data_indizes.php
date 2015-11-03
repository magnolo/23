<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddingColumnFieldToDataIndizes extends Migration
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
          $table->string('column_name')->nullable();
          $table->string('countries_iso_field')->nullable()->change();
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
          $table->dropColumn('column_name');
        });
    }
}
