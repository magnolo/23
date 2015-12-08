<?php

use Illuminate\Database\Seeder;

use App\ItemType;

class ItemTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('23_item_types')->delete();
        ItemType::create([
          'name' => 'group',
          'title' => 'Group'
        ]);
        ItemType::create([
          'name' => 'aggregat',
          'title' => 'Aggregat'
        ]);
        ItemType::create([
          'name' => 'composit',
          'title' => 'Composit'
        ]);
        ItemType::create([
          'name' => 'index',
          'title' => 'Index'
        ]);

    }
}
