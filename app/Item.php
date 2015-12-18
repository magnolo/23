<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Style;

class Item extends Model
{
    //
    protected $table="23_items";

    public function child(){
      return $this->hasMany('App\Item', 'parent_id', 'id');
    }
    public function parent(){
      return $this->hasOne('App\Item', 'id', 'parent_id');
    }
    public function children(){
      return $this->child()->with('children','type','style');
    }
    public function indicator(){
      return $this->hasOne('App\Indicator', 'id','indicator_id');
    }
    public function type(){
      return $this->hasOne('App\ItemType', 'id', 'item_type_id');
    }
    public function style(){
      return $this->hasOne('App\Style', 'id', 'style_id');
    }
    public function getStyle() {
      if ($this->style) {
        return $this->style;
      }
      if ($this->indicator and $this->indicator->style) {
        return $this->indicator->style;
      }
      return $this->indicator->categorie->style;
    }
}
