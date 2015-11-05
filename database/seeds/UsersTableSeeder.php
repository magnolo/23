<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('users')->insert([
           'name' => 'Manfred Walder',
           'email' => 'office@manfredwalder.at',
           'password' => bcrypt('vald12345'),
           'created_at' => 'NOW()',
           'updated_at' => 'NOW()'
          ]);
    }
}
