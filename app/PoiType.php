<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PoiType extends Model
{
    //
    protected $table = "point_of_interests_types";

    public function pov(){
      return $this->belongsToMany('App\Poi');
    }
}
