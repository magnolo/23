<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIndicatorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('23_indicators', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('userdata_id')->unsigned();
            //$table->foreign('userdata_id')->references('id')->on('23_userdata');
            $table->integer('measure_type_id')->unsigned();
            $table->enum('type',['abs', 'per']);
            //$table->foreign('measure_type_id')->references('id')->on('23_measure_types');
            $table->integer('style_id')->default(0);
            //$table->foreign('style_id')->references('id')->on('23_styles');
            $table->string('table_name');
            $table->string('column_name');
            $table->string('iso_name');
            $table->boolean('is_public')->default(false);
            $table->boolean('is_official')->default(false);
            $table->string('name');
            $table->string('title');
            $table->text('description')->nullable();
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
        Schema::drop('23_indicators');
    }
}
