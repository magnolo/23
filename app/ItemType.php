<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ItemType extends Model
{
    //
    protected $table="23_items_types";

    public function items(){
      return $this->hasMany('App\Item');
    }
}
