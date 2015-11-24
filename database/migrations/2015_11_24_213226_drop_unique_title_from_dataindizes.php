<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropUniqueTitleFromDataindizes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('data_indizes', function($table)
        {
            $table->dropUnique('data_indizes_title_unique');
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
        Schema::table('data_indizes', function($table)
        {
            $table->unique('title');
        });
    }
}
