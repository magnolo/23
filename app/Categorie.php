<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    //
    protected $table = "23_categories";

    public function indicators(){
      return $this->belongsToMany('App\Indicator', 'indicator_categories', 'categorie_id', 'indicator_id');
    }
    public function indices(){
      return $this->belongsToMany('App\Index', 'indicator_categories', 'categorie_id', 'indicator_id');
    }
}
