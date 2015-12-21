<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Style;

class Item extends Model
{
    //
    protected $table="23_items";

    public function parent(){
      return $this->belongsTo('App\Item', 'parent_id');
    }
    public function children(){
      return $this->hasMany('App\Item', 'parent_id')->with('children','type');
    }
    public function indicator(){
      return $this->belongsTo('App\Indicator', 'indicator_id');
    }
    public function type(){
      return $this->belongsTo('App\ItemType', 'item_type_id');
    }
    public function style(){
      return $this->belongsTo('App\Style', 'style_id');
    }
    public function getStyle() {
      if ($this->style) {
        return $this->style;
      }
      if ($this->indicator and $this->indicator->style) {
        return $this->indicator->style;
      }
      if ($this->indicator and $this->indicator->categories) {
        return $this->indicator->categories[0]->style;
      }
      return null;
    }
}
