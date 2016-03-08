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
    }
}
