<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPublicToBasmap extends Migration
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
            $table->boolean('is_public')->default('false');
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
            $table->dropColumn('is_public');
        });
    }
}
