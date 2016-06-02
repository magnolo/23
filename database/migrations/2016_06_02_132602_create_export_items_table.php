<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExportItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('export_items', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('export_id')->unsigned();
            $table->integer('parent_id')->unsigned()->nullable();
            $table->integer('indicator_id')->nullable();
            $table->string('name')->nullable();
            $table->string('title')->nullable();
            $table->integer('style_id')->nullable();
            $table->integer('image_id')->nullable();
            $table->text('description')->nullable();
            $table->string('type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('export_items');
    }
}
