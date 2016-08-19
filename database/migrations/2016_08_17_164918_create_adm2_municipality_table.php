<?php

use Phaza\LaravelPostgis\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAdm2MunicipalityTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('adm2', function (Blueprint $table) {
            $table->increments('id');

            $table->multipolygon('geom');
            $table->integer('id_0');
            $table->string('iso',3);
            $table->string('name_0',75);
            $table->integer('id_1');
            $table->string('name_1',75);
            $table->integer('id_2');
            $table->string('name_2',75);
            $table->string('hasc_2',15);
            $table->integer('ccn_2')->nullable();
            $table->string('cca_2',254)->nullable();
            $table->string('type_2',50);
            $table->string('engtype_2',50)->nullable();
            $table->string('nl_name_2',50)->nullable();
            $table->string('varname_2',150)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('adm2');
    }
}
