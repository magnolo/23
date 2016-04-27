<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddGenderFieldToUserdata extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('userdata', function (Blueprint $table) {
            //
            $table->string('gender')->nullable();
            $table->text('description_field')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('userdata', function (Blueprint $table) {
            //
            $table->dropColumn(['gender', 'description_field']);
        });
    }
}
