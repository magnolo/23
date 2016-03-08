<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Conflictevent extends Model
{
    //
    protected $table="conflict_events";
    public $timestamps  = false;

    public function nations(){
      return $this->belongsToMany('App\Conflictnation', 'conflict_nation_events', 'conflict_event_id', 'conflict_nation_id');

    }
    public function related(){

    }
    public function type(){

    }
}
