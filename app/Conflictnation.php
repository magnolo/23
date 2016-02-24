<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Conflictnation extends Model
{
    //
    protected $table="23_conflict_nations";
    public $timestamps = false;

    public function conflicts(){
      return $this->belongsToMany('App\Conflictevent', '23_conflict_nation_events', 'conflict_nation_id', 'conflict_event_id')->with('nations');
    }

}
