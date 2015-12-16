<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Graph extends Model
{
    //
    protected $table="23_graphs";

    public function types(){
      return $this->belongsToMany("App\MeasureType", "23_graph_measuretypes", "graph_id", "measure_type_id");
    }
    public function categories(){
      return $this->belongsToMany("App\Categorie", "23_categorie_graphs", "graph_id", "categorie_id");
    }
}
