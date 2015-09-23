<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EPI extends Model
{
    //
    protected $table="epi";

    public function nation(){
      return $this->hasOne('App\Nation');
    }
}
