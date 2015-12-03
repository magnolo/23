<?php

use Illuminate\Database\Seeder;

use App\DataProvider;

class DataProvidersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('23_dataproviders')->delete();
        DataProvider::create([
          'name' => 'worldbank',
          'title' => 'The World Bank',
          'url' => 'http://www.worldbank.org'
        ]);
        DataProvider::create([
          'name' => 'ycelp',
          'title' => 'Yale Center for Environmental Law & Policy',
          'url' => 'http://epi.yale.edu'
        ]);
    }
}
