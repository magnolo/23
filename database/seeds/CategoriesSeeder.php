<?php

use Illuminate\Database\Seeder;

use App\Categorie;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('23_categories')->delete();
        Categorie::create([
          'name' => 'environment',
          'title' => 'Environment',
          'user_id' => 0
        ]);
        Categorie::create([
          'name' => 'human',
          'title' => 'Human',
          'user_id' => 0
        ]);
        Categorie::create([
          'name' => 'animals',
          'title' => 'Animals',
          'user_id' => 0
        ]);
    }
}
