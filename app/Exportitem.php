<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Exportitem extends Model
{
    //
    protected $table="export_items";

    public function parent(){
      return $this->belongsTo('App\Exportitem', 'parent_id')->with('image','style');
    }
    public function children(){
      return $this->hasMany('App\Exportitem', 'parent_id')->with('children','style', 'image', 'parent', 'indicator')->orderBy('id');
    }
    public function indicator(){
      return $this->belongsTo('App\Indicator', 'indicator_id');
    }
    public function style(){
      return $this->belongsTo('App\Style', 'style_id')->with('basemap', 'image');
    }
    public function export(){
      return $this->belongsTo('App\Export', 'export_id');
    }
    public function image(){
      return $this->belongsTo('App\Image');
    }
}
