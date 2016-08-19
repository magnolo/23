<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRelationshipBetweenAdm123 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {/*
        Schema::table('adm1', function ($table) {
            $table->integer('id_1')->unique();
        });

        Schema::table('adm2', function ($table) {
            $table->integer('id_2')->unique();
        });

        Schema::table('adm3', function ($table) {
            $table->integer('id_3')->unique();
        });

        Schema::table('adm2', function ($table) {
            $table->foreign('id_1')->references('id_1')->on('adm1')->onDelete('cascade');
        });
        Schema::table('adm3', function ($table) {
            $table->foreign('id_1')->references('id_1')->on('adm1')->onDelete('cascade');
            $table->foreign('id_2')->references('id_2')->on('adm2')->onDelete('cascade');
        });*/
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {/*
        Schema::table('adm2', function ($table) {
            $table->dropForeign('adm2_id_1_foreign');
        });

        Schema::table('adm3', function ($table) {
            $table->dropForeign('adm3_id_1_foreign');
            $table->dropForeign('adm3_id_2_foreign');
        });*/
    }
}
