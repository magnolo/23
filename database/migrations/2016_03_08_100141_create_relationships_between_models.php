<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRelationshipsBetweenModels extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table("items", function($table){
          $table->foreign("indicator_id")->references("id")->on("indicators")->onDelete("cascade");
          $table->foreign("parent_id")->references("id")->on("items")->onDelete("cascade");
        });
        Schema::table('categories', function ($table) {
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('parent_id')->references('id')->on('categories');
            $table->foreign('style_id')->references('id')->on('styles');
        });
        Schema::table('indicators', function ($table) {
          $table->foreign('userdata_id')->references('id')->on('userdata');
          $table->foreign('measure_type_id')->references('id')->on('measure_types');
          $table->foreign('style_id')->references('id')->on('styles');
          $table->foreign('dataprovider_id')->references('id')->on('dataproviders');
        });
        Schema::table('userdata', function ($table) {
          $table->foreign('user_id')->references('id')->on('users');
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
         Schema::table("items", function($table){
            $table->dropForeign("items_indicator_id_foreign");
            $table->dropForeign("items_parent_id_foreign");
          });
          Schema::table('categories', function ($table) {
                $table->dropForeign('categories_user_id_foreign');
                $table->dropForeign('categories_parent_id_foreign');
                $table->dropForeign('categories_style_id_foreign');
            });
            Schema::table('indicators', function ($table) {
                $table->dropForeign('indicators_userdata_id_foreign');
                $table->dropForeign('indicators_measure_type_id_foreign');
                $table->dropForeign('indicators_style_id_foreign');
                $table->dropForeign('indicators_dataprovider_id_foreign');
            });
            Schema::table('userdata', function ($table) {
                $table->dropForeign('userdata_user_id_foreign');
            });
    }
}
