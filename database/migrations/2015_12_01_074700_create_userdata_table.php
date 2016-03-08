<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserdataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('userdata', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->string('table_name');
            $table->string('iso_name');
            $table->string('iso_type');
            $table->string('country_name');
            $table->json('meta_data');
            $table->string('name');
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('caption')->nullable();
            $table->boolean('is_public')->default(false);
            $table->boolean('is_official')->default(false);
            $table->boolean('is_api')->default(false);
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
        Schema::drop('userdata');
    }
}
