<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ResetImagesTableToNew extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::drop('images');
        Schema::create('images', function (Blueprint $table) {
            $table->increments('id');
            $table->string('src');
            $table->string('basename');
            $table->string('dir');
            $table->string('filename');
            $table->string('size')->nullable();
            $table->string('width')->nullable();
            $table->string('height')->nullable();
            $table->text('description')->nullable();
            $table->text('caption')->nullable();
            $table->string('thumb_big_url')->nullable();
            $table->string('thumb_url')->nullable();
            $table->json('crop')->nullable();
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
        Schema::drop('images');
    }
}
