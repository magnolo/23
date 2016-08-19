<?php

use Phaza\LaravelPostgis\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAdm1ProvinceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('adm1', function (Blueprint $table) {
            $table->increments('id');

            $table->multipolygon('geom');
            $table->integer('id_0');
            $table->string('iso',3);
            $table->string('name_0',75);
            $table->integer('id_1');
            $table->string('name_1',75);
            $table->string('hasc_1',15);
            $table->integer('ccn_1')->nullable();
            $table->string('cca_1',254)->nullable();
            $table->string('type_1',50);
            $table->string('engtype_1',50)->nullable();
            $table->string('nl_name_1',50)->nullable();
            $table->string('varname_1',150)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('adm1');
    }
}
