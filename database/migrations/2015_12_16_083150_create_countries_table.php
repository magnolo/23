<?php


use Illuminate\Database\Migrations\Migration;
use Phaza\LaravelPostgis\Schema\Blueprint;

class CreateCountriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('countries', function (Blueprint $table) {
            $table->increments('id');

            // phaza/laravel-postgis creates geography field instead of geometry
            $table->multipolygon('geom');
            $table->integer('scalerank')->nullable();
            $table->string('featurecla',30);
            $table->integer('lablerank')->nullable();
            $table->string('sovereignt',32)->nullable();
            $table->string('sov_a3',3)->nullable();
            $table->integer('adm0_dif')->nullable();
            $table->integer('level')->nullable();
            $table->string('type', 17);
            $table->string('admin', 40);
            $table->string('adm0_a3',3);
            $table->integer('geou_dif')->nullable();
            $table->string('geounit', 40)->nullable();
            $table->string('gu_a3', 3)->nullable();
            $table->integer('su_dif')->nullable();
            $table->string('subunit', 40)->nullable();
            $table->string('su_a3', 3)->nullable();
            $table->integer('brk_diff')->nullable();
            $table->string('name', 36);
            $table->string('name_long', 40);
            $table->string('brk_a3', 3)->nullable();
            $table->string('brk_name', 36)->nullable();
            $table->string('brk_group', 30)->nullable();
            $table->string('abbrev',13)->nullable();
            $table->string('postal', 4)->nullable();
            $table->string('formal_en', 52)->nullable();
            $table->string('formal_fr', 35)->nullable();
            $table->string('note_adm0', 22)->nullable();
            $table->string('note_brk', 164)->nullable();
            $table->string('name_sort', 36)->nullable();
            $table->string('name_alt', 38)->nullable();
            $table->integer('mapcolor7')->nullable();
            $table->integer('mapcolor8')->nullable();
            $table->integer('mapcolor9')->nullable();
            $table->integer('mapcolor13')->nullable();
            $table->integer('pop_est')->nullable();
            $table->double('gdp_md_est')->nullable();
            $table->integer('pop_year')->nullable();
            $table->integer('lastcensus')->nullable();
            $table->integer('gdp_year')->nullable();
            $table->string('economy', 26)->nullable();
            $table->string('income_grp', 23)->nullable();
            $table->integer('wikipedia')->nullable();
            $table->string('fips_10_', 3)->nullable();
            $table->string('iso_a2', 5);
            $table->string('iso_a3', 3);
            $table->string('iso_n3', 3)->nullable();
            $table->string('un_a3', 4)->nullable();
            $table->string('wb_a2', 3)->nullable();
            $table->string('wb_a3', 3)->nullable();
            $table->integer('woe_id')->nullable();
            $table->integer('woe_id_eh')->nullable();
            $table->string('woe_noe', 190)->nullable();
            $table->string('adm0_a3_is', 3)->nullable();
            $table->string('adm0_a3_us', 3)->nullable();
            $table->integer('adm0_a3_un')->nullable();
            $table->integer('adm0_a3_wb')->nullable();
            $table->string('continent',23);
            $table->string('region_un', 23)->nullable();
            $table->string('subregion', 25)->nullable();
            $table->string('region_wb', 26)->nullable();
            $table->integer('name_len')->nullable();
            $table->integer('long_len')->nullable();
            $table->integer('abbrev_len')->nullable();
            $table->integer('tiny')->nullable();
            $table->integer('homepart')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('countries');
    }
}
