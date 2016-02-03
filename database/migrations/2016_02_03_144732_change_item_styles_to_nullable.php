<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeItemStylesToNullable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"23_items"', function (Blueprint $table) {
            //
            $table->string('style_id')->nullable()->change();
            $table->string('is_public')->nullable()->change();
            $table->string('is_official')->nullable()->change();
            $table->string('parent_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('23_items', function (Blueprint $table) {
            //
        });
    }
}
