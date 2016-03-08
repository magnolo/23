<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Graph extends Model
{
    //
    protected $table="graphs";

    public function types(){
      return $this->belongsToMany("App\MeasureType", "graph_measuretypes", "graph_id", "measure_type_id");
    }
    public function categories(){
      return $this->belongsToMany("App\Categorie", "categorie_graphs", "graph_id", "categorie_id");
    }
}
