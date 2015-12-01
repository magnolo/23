<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Style extends Model
{
    //
    protected $table="23_styles";

    public function indicators(){
      return $this->hasMany('App\Indicator');
    }
    public function categories(){
      return $this->hasMany('App\Categorie');
    }
}
