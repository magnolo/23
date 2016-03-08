<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('images', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('title');
            $table->string('filename');
            $table->text('description')->nullable();
            $table->text('caption')->nullable();
            $table->string('url');
            $table->string('thumb_big_url');
            $table->string('thumb_url');
            $table->string('folder');
            $table->bigInteger('size')->unsigned();
            $table->json('crop')->nullable();
            $table->char('ext',5);
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
