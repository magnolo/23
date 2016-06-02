<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Export extends Model
{
    //
    public function items(){
      return $this->hasMany('App\Exportitem')->with(['children','style', 'indicator']);
    }
    public function image(){
      return $this->belongsTo('App\Image');
    }
}
