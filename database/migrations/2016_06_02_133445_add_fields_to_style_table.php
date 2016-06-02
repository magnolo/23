<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsToStyleTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('styles', function (Blueprint $table) {
            //
            $table->integer('basemap_id')->nullable();
            $table->boolean('fixed_title')->nullable();
            $table->boolean('fixed_description')->nullable();
            $table->boolean('search_box')->nullable();
            $table->boolean('share_options')->nullable();
            $table->boolean('zoom_controls')->nullable();
            $table->boolean('scroll_wheel_zoom')->nullable();
            $table->boolean('layer_selection')->nullable();
            $table->boolean('legends')->nullable();
            $table->boolean('full_screen')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('styles', function (Blueprint $table) {
            //
            $table->dropColumn(['basemap_id', 'fixed_title', 'fixed_description', 'search_box', 'share_options', 'zoom_controls', 'scroll_wheel_zoom', 'layer_selection', 'legends', 'full_screen']);
        });
    }
}
