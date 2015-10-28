<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class IndexItem extends Model
{
    //
    protected $table="data_indizes_structures";

    public function index(){
      return $this->belongsTo('App\Index');
    }
    public function children(){
      return $this->hasMany('IndexItem', 'parent_id', 'id');
    }
    public function allChildren(){
      return $this->children()->with('allChildren');
    }
}
