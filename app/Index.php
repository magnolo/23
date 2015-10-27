<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Index extends Model
{
    //
    protected $table="data_indizes";

    public function items(){
      return $this->hasMany('App\IndexItem', 'data_indizes_id' , 'id')->where('parent_id', 0);
    }
  
}
