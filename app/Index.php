<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Index extends Model
{
    //
    protected $table="data_indizes";

    public function child(){
      return $this->hasMany('App\Index', 'parent_id', 'id');
    }
    public function children(){
      return $this->child()->with('children');
    }

}
