<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ExtendBasemapTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('basemaps', function (Blueprint $table) {
            //
            $table->string('ext',3)->nullable();
            $table->string('subdomains', 10)->nullable();
            $table->integer('minZoom')->nullable();
            $table->integer('maxZoom')->nullable();
            $table->json('bounds')->nullable();
            $table->string('key')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('basemaps', function (Blueprint $table) {
            //
            $table->dropColumn(['ext', 'subdomains', 'minZoom', 'maxZoom', 'bounds', 'key']);
        });
    }
}
