<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Nation extends Model
{
    //
    protected $table = "nations";

    public function epi(){
      return $this->hasMany('App\Epi', 'country_id', 'id')->orderBy('year', 'ASC');
    }
}
