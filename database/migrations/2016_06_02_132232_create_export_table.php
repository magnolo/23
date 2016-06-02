<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExportTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exports', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->integer('layout_id');
            $table->string('name');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('business')->nullable();
            $table->integer('image_id')->nullable();
            $table->string('url', 500)->nullable();
            $table->text('usage')->nullable();
            $table->boolean('is_published')->default(false);
            $table->boolean('is_official')->default(false);
            $table->softDeletes();
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
        Schema::drop('exports');
    }
}
