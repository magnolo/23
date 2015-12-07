<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Index extends Model
{
    //
    protected $table="23_items";
    //protected $calced= array();

    public function child(){
      return $this->hasMany('App\Index', 'parent_id', 'id');
    }
    public function parent(){
      return $this->hasOne('App\Index', 'id', 'parent_id');
    }
    public function children(){
      return $this->child()->with('children');
    }

}
