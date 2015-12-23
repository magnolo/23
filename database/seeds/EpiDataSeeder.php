<?php

use Flynsarmy\CsvSeeder\CsvSeeder;

class EpiDataSeeder extends CsvSeeder
{

  public function __construct()
 {
     $this->table = 'user_table_epi';
     $this->csv_delimiter = ',';
     $this->insert_chunk_size = 100;
     $this->filename = base_path().'/database/seeds/csv/epi.csv';


 }
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        //DB::disableQueryLog();
        DB::table($this->table)->truncate();
        parent::run();
    }
}
