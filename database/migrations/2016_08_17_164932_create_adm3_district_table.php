<?php

use Phaza\LaravelPostgis\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAdm3DistrictTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('adm3', function (Blueprint $table) {
            $table->increments('id');

            $table->multipolygon('geom');
            $table->integer('id_0');
            $table->string('iso',3);
            $table->string('name_0',75);
            $table->integer('id_1');
            $table->string('name_1',75);
            $table->integer('id_2');
            $table->string('name_2',75);
            $table->string('hasc_2_d',25)->nullable();
            $table->integer('id_3');
            $table->string('name_3',75);
            $table->integer('ccn_3')->nullable();
            $table->string('cca_3',254)->nullable();
            $table->string('type_3',50);
            $table->string('engtype_3',50)->nullable();
            $table->string('nl_name_3',50)->nullable();
            $table->string('varname_3',150)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('adm3');
    }
}
