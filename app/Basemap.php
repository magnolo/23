<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Basemap extends Model
{
    //
    public function image(){
      return $this->belongsTo('App\Image');
    }
    public function exports(){
      return $this->hasManyTrough('App\Export', 'App\Style');
    }
}
