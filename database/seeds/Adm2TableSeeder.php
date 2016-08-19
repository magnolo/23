<?php

use Flynsarmy\CsvSeeder\CsvSeeder;

class Adm2TableSeeder extends CsvSeeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function __construct()
    {
        $this->table = 'adm2';
        $this->csv_delimiter = ';';
        $this->insert_chunk_size = 33;
        $this->filename = base_path().'/database/seeds/csv/adm2_table.csv';


    }
    public function run()
    {
        //
        DB::disableQueryLog();
        DB::table($this->table)->truncate();
        parent::run();
    }
}
