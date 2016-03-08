<?php

use Illuminate\Database\Seeder;

use App\MeasureType;

class MeasureTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('measure_types')->delete();

        MeasureType::create([
          'name' => 'absolute',
          'title' => 'Absolute Values',
          'ext' => ''
        ]);
        MeasureType::create([
          'name' => 'percentage',
          'title' => 'Percentage',
          'ext' => '%'
        ]);
        MeasureType::create([
          'name' => 'kwh',
          'title' => 'Kilowatt per Hour',
          'ext' => 'kW/h'
        ]);
    }
}
