<?php

use Illuminate\Database\Seeder;

use App\Basemap;

class BasemapTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $basemaps = [
          [
            "title" => "Open Streetmap Mapnik",
            "name" => "open-streetmpa-mapnik",
            "url" => "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "provider" => "OpenStreetMap"
          ],
          [
            "title" => "Spinal Tap",
            "name" => "spinal-tap",
            "url" => "http://{s}.tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png"
          ],
          [
            "title" => "Stamen Watercolor",
            "name" => "stamen-watercolor",
            "url" => "http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png"
          ],
          [
            "title" => "CartoDB NoLabels",
            "name" => "cartodb-nolabels",
            "url" => "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
            "provider" => 'CartoDB'
          ],
          [
            "title" => "CartoDB Dark NoLabels",
            "name" => "cartodb-dark-nolabels",
            "url" => "http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
            "provider" => 'CartoDB'
          ]
        ];

        foreach($basemaps as $map){
          $basemap = Basemap::create($map);
        }
    }
}
