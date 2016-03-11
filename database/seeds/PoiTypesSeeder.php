<?php

use Illuminate\Database\Seeder;

use App\PoiType;

class PoiTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('point_of_interests_types')->delete();
        PoiType::create([
          'name' => 'human',
          'title' => 'Human'
        ]);
    }
}
