<?php

use Illuminate\Database\Seeder;

use App\Style;

class StyleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $style = new Style([
          'name' => 'environment',
          'title' => 'Environment',
          'base_color' => '#D81E05',
          'icon_name' => 'tree'
        ]);
        $style->save();
        $style = new Style([
          'name' => 'human',
          'title' => 'Human',
          'base_color' => '#006bb9',
          'icon_name' => 'man'
        ]);
        $style->save();
        $style = new Style([
          'name' => 'animal',
          'title' => 'Animal',
          'base_color' => '#D81E05',
          'icon_name' => 'butterfly'
        ]);
        $style->save();
    }
}
