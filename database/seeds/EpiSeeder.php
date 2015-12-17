<?php

use Illuminate\Database\Seeder;

use App\UserData;
use App\Indicator;
use App\Item;

class EpiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public $int = 0;

    public function range($min, $max = null){
      if(is_null($max)){
        $max = $min;
      }
      return($this->int <= $max && $this->int >= $min);
    }

    public function run()
    {
        //
        $indicators = array (
  0 =>
  array (
    'column' => 'score',
    'title' => 'Environment Performance Index',
  ),
  1 =>
  array (
    'column' => 'eh',
    'title' => 'Environmental Health',
  ),
  2 =>
  array (
    'column' => 'eh_hi',
    'title' => 'Health Impact',
  ),
  3 =>
  array (
    'column' => 'eh_aq',
    'title' => 'Air Quality',
  ),
  4 =>
  array (
    'column' => 'eh_hi_child_mortality',
    'title' => 'Child Mortality',
  ),
  5 =>
  array (
    'column' => 'eh_aq_household_air_quality',
    'title' => 'Household Air Quality',
  ),
  6 =>
  array (
    'column' => 'eh_aq_exposure_pm25',
    'title' => 'Air Pollution - Average Exposure to PM2.5',
  ),
  7 =>
  array (
    'column' => 'eh_aq_exceedance_pm25',
    'title' => 'Air Pollution - PM2.5 Exceedance',
  ),
  8 =>
  array (
    'column' => 'eh_ws',
    'title' => 'Water Sanitation',
  ),
  9 =>
  array (
    'column' => 'ev',
    'title' => 'Ecosystem Validity',
  ),
  10 =>
  array (
    'column' => 'ev_wr',
    'title' => 'Water Resources',
  ),
  11 =>
  array (
    'column' => 'ev_wr_wastewater_treatment',
    'title' => 'Wastewater Treatment',
  ),
  12 =>
  array (
    'column' => 'ev_ag',
    'title' => 'Agriculture',
  ),
  13 =>
  array (
    'column' => 'ev_ag_agricultural_subsidies',
    'title' => 'Agricultural Subsidies',
  ),
  14 =>
  array (
    'column' => 'ev_ag_pesticide_regulation',
    'title' => 'Pesticide Regulation',
  ),
  15 =>
  array (
    'column' => 'ev_fo',
    'title' => 'Forest',
  ),
  16 =>
  array (
    'column' => 'ev_fo_change_in_forest_cover',
    'title' => 'Change in Forest Cover',
  ),
  17 =>
  array (
    'column' => 'ev_fi',
    'title' => 'Fisheries',
  ),
  18 =>
  array (
    'column' => 'ev_fi_coastal_shelf_fishing_pressure',
    'title' => 'Coastal Shelf Fishing Pressure',
  ),
  19 =>
  array (
    'column' => 'ev_fi_fish_stocks',
    'title' => 'Fish Stocks',
  ),
  20 =>
  array (
    'column' => 'ev_bd',
    'title' => 'Biodiversity and Habitat',
  ),
  21 =>
  array (
    'column' => 'ev_bd_terrestrial_protected_areas_national_biome',
    'title' => 'National Biome Protection',
  ),
  22 =>
  array (
    'column' => 'ev_bd_terrestrial_protected_areas_global_biome',
    'title' => 'Global Biome Protection',
  ),
  23 =>
  array (
    'column' => 'ev_bd_marine_protected_areas',
    'title' => 'Marine Protected Areas',
  ),
  24 =>
  array (
    'column' => 'ev_bd_critical_habitat_protection',
    'title' => 'Critical Habitat Protection',
  ),
  25 =>
  array (
    'column' => 'ev_ce',
    'title' => 'Climate and Energy',
  ),
  26 =>
  array (
    'column' => 'ev_ce_trend_in_carbon_intensity',
    'title' => 'Trend in Carbon Intensity',
  ),
  27 =>
  array (
    'column' => 'ev_ce_change_of_trend_in_carbon_intensity',
    'title' => 'Change of Trend in Carbon Intensity',
  ),
  28 =>
  array (
    'column' => 'ev_ce_trend_in_co2_emissions_per_kwh',
    'title' => 'Trend in CO2 Emissions per KWH',
  ),
  29 =>
  array (
    'column' => 'eh_ws_access_to_drinking_water',
    'title' => 'Access to Drinking Water',
  ),
  30 =>
  array (
    'column' => 'eh_ws_access_to_sanitation',
    'title' => 'Access to Sanitation',
  ),
);

        $ud = new UserData();
        $ud->user_id = 2;
        $ud->table_name = "user_table_epi";
        $ud->iso_name = "iso";
        $ud->iso_type = "iso-3166-2";
        $ud->country_name = "country";
        $ud->name = "epi";
        $ud->title = "Environmental Performance Index";
        $ud->meta_data = '[{"column":"score","title":"Environment Performance Index"},{"column":"eh","title":"Environmental Health"},{"column":"eh_hi","title":"Health Impact"},{"column":"eh_aq","title":"Air Quality"},{"column":"eh_hi_child_mortality","title":"Child Mortality"},{"column":"eh_aq_household_air_quality","title":"Household Air Quality"},{"column":"eh_aq_exposure_pm25","title":"Air Pollution - Average Exposure to PM2.5"},{"column":"eh_aq_exceedance_pm25","title":"Air Pollution - PM2.5 Exceedance"},{"column":"eh_ws","title":"Water Sanitation"},{"column":"ev","title":"Ecosystem Validity"},{"column":"ev_wr","title":"Water Resources"},{"column":"ev_wr_wastewater_treatment","title":"Wastewater Treatment"},{"column":"ev_ag","title":"Agriculture"},{"column":"ev_ag_agricultural_subsidies","title":"Agricultural Subsidies"},{"column":"ev_ag_pesticide_regulation","title":"Pesticide Regulation"},{"column":"ev_fo","title":"Forest"},{"column":"ev_fo_change_in_forest_cover","title":"Change in Forest Cover"},{"column":"ev_fi","title":"Fisheries"},{"column":"ev_fi_coastal_shelf_fishing_pressure","title":"Coastal Shelf Fishing Pressure"},{"column":"ev_fi_fish_stocks","title":"Fish Stocks"},{"column":"ev_bd","title":"Biodiversity and Habitat"},{"column":"ev_bd_terrestrial_protected_areas_national_biome","title":"National Biome Protection"},{"column":"ev_bd_terrestrial_protected_areas_global_biome","title":"Global Biome Protection"},{"column":"ev_bd_marine_protected_areas","title":"Marine Protected Areas"},{"column":"ev_bd_critical_habitat_protection","title":"Critical Habitat Protection"},{"column":"ev_ce","title":"Climate and Energy"},{"column":"ev_ce_trend_in_carbon_intensity","title":"Trend in Carbon Intensity"},{"column":"ev_ce_change_of_trend_in_carbon_intensity","title":"Change of Trend in Carbon Intensity"},{"column":"ev_ce_trend_in_co2_emissions_per_kwh","title":"Trend in CO2 Emissions per KWH"},{"column":"eh_ws_access_to_drinking_water","title":"Access to Drinking Water"},{"column":"eh_ws_access_to_sanitation","title":"Access to Sanitation"}]';
        $ud->save();

        if($ud->id){
          foreach($indicators as $indicator){
            $ind = new Indicator();
            $ind->measure_type_id = 2;
            $ind->dataprovider_id = 2;
            $ind->column_name = $indicator['column'];
            $ind->userdata_id = $ud->id;
            $ind->iso_name = $ud->iso_name;
            $ind->table_name = $ud->table_name;
            $ind->name = $indicator['column'];
            $ind->title = $indicator['title'];
            $ind->save();

            $this->int = $ind->id;
            if($this->range(1)) $parent = 0;
            else if($this->range(2)) $parent = 1;
            else if($this->range(3,4))  $parent = 2;
            else if($this->range(5))  $parent = 3;
            else if($this->range(6,8))  $parent = 4;
            else if($this->range(9))  $parent = 2;
            else if($this->range(10))  $parent = 1;
            else if($this->range(11))  $parent = 10;
            else if($this->range(12))  $parent = 11;
            else if($this->range(13))  $parent = 10;
            else if($this->range(14,15))  $parent = 13;
            else if($this->range(16))  $parent = 10;
            else if($this->range(17))  $parent = 16;
            else if($this->range(18))  $parent = 10;
            else if($this->range(19,20))  $parent = 18;
            else if($this->range(21))  $parent = 10;
            else if($this->range(22,25))  $parent = 21;
            else if($this->range(26))  $parent = 10;
            else if($this->range(27,29))  $parent = 26;
            else if($this->range(30,31))  $parent = 9;


            $item = new Item([
              'parent_id' => $parent,
              'user_id' => 2,
              'indicator_id' => $ind->id,
              'item_type_id' => 4,
              'name' => $ind->name,
              'title' => $ind->title
            ]);
            $item->save();
          }



        }
    }
}
