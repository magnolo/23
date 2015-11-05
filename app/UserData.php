<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserData extends Model
{
    //
    protected $table='user_data';

    public function user(){
      return $this->belongsTo('App\User', 'user_id', 'id');
    }
    public function indizes(){
      return $this->hasMany('App\Index', 'table', 'table_name')->where('parent_id', 0);
      //return DB::($this->attributes['table_name'])->all();
    }
}
