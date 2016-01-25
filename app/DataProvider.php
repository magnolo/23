<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DataProvider extends Model
{
    //
    protected $table="23_dataproviders";

    public function indicators(){
      return $this->hasMany('App\Indicator', 'dataprovider_id')->orderBy('name', 'ASC');
    }
}
