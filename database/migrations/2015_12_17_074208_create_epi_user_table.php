<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEpiUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_table_epi', function (Blueprint $table) {
            $table->increments('id');
            $table->string('iso', 3);
            $table->string('country', 100);
            $table->double('score')->nullable();
            $table->double('eh')->nullable();
            $table->double('ev')->nullable();
            $table->double('eh_hi')->nullable();
            $table->double('eh_aq')->nullable();
            $table->double('eh_ws')->nullable();
            $table->double('ev_wr')->nullable();
            $table->double('ev_ag')->nullable();
            $table->double('ev_fo')->nullable();
            $table->double('ev_fi')->nullable();
            $table->double('ev_bd')->nullable();
            $table->double('ev_ce')->nullable();
            $table->double('eh_hi_child_mortality')->nullable();
            $table->double('eh_aq_household_air_quality')->nullable();
            $table->double('eh_aq_exposure_pm25')->nullable();
            $table->double('eh_aq_exceedance_pm25')->nullable();
            $table->double('eh_ws_access_to_sanitation')->nullable();
            $table->double('eh_ws_access_to_drinking_water')->nullable();
            $table->double('ev_wr_wastewater_treatment')->nullable();
            $table->double('ev_ag_agricultural_subsidies')->nullable();
            $table->double('ev_ag_pesticide_regulation')->nullable();
            $table->double('ev_fo_change_in_forest_cover')->nullable();
            $table->double('ev_fi_fish_stocks')->nullable();
            $table->double('ev_fi_coastal_shelf_fishing_pressure')->nullable();
            $table->double('ev_bd_terrestrial_protected_areas_national_biome')->nullable();
            $table->double('ev_bd_terrestrial_protected_areas_global_biome')->nullable();
            $table->double('ev_bd_marine_protected_areas')->nullable();
            $table->double('ev_bd_critical_habitat_protection')->nullable();
            $table->double('ev_ce_trend_in_carbon_intensity')->nullable();
            $table->double('ev_ce_change_of_trend_in_carbon_intensity')->nullable();
            $table->double('ev_ce_trend_in_co2_emissions_per_kwh')->nullable();
            $table->double('access_to_electricity')->nullable();
            $table->integer('year')->unsigned();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('user_table_epi');
    }
}
