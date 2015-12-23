<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateForeignKeys extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        /*Schema::table('23_categories', function ($table) {
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('parent_id')->references('id')->on('23_categories');
            $table->foreign('style_id')->references('id')->on('23_styles');
        });
        Schema::table('23_indicators', function ($table) {
          $table->foreign('userdata_id')->references('id')->on('23_userdata');
          $table->foreign('measure_type_id')->references('id')->on('23_measure_types');
          $table->foreign('style_id')->references('id')->on('23_styles');
          $table->foreign('dataprovider_id')->references('id')->on('23_dataproviders');
        });
        Schema::table('23_userdata', function ($table) {
          $table->foreign('user_id')->references('id')->on('users');
        });*/
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
      /*  Schema::table('23_categories', function ($table) {
            $table->dropForeign('23_categories_user_id_foreign');
            $table->dropForeign('23_categories_parent_id_foreign');
            $table->dropForeign('23_categories_style_id_foreign');
        });
        Schema::table('23_indicators', function ($table) {
            $table->dropForeign('23_indicators_userdata_id_foreign');
            $table->dropForeign('23_indicators_measure_type_id_foreign');
            $table->dropForeign('23_indicators_style_id_foreign');
            $table->dropForeign('23_indicators_dataprovider_id_foreign');
        });
        Schema::table('23_userdata', function ($table) {
            $table->dropForeign('23_userdata_user_id_foreign');
        });*/
    }
}
