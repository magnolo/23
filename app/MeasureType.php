<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MeasureType extends Model
{
    //
    protected $table = "23_measure_types";

    public function indicators(){
      return $this->hasMany('App\Indicator');
    }
}
