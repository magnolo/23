<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Input;

class Indicator extends Model
{
    //
    protected $table = "23_indicators";

    protected $fillable = ['is_official', 'is_public', 'title', 'description'];
    protected $hidden = ['userdata_id', 'iso_name', 'column_name', 'table_name', 'pivot'];


    public function categories(){
      return $this->belongsToMany('App\Categorie', '23_indicator_categories', 'indicator_id', 'categorie_id')->with('style');
    }
    public function userdata(){
      return $this->belongsTo('App\UserData');
    }
    public function dataprovider(){
      return $this->belongsTo('App\DataProvider', 'dataprovider_id');
    }
    public function type(){
      return $this->belongsTo('App\MeasureType', 'measure_type_id');
    }
    public function style(){
      return $this->belongsTo('App\Style', 'style_id');
    }
    public function getStyle() {
      if ($this->style) {
        return $this->style;
      }
      if ($this->categories) {
        return $this->categories[0]->style;
      }
      return null;
    }

}
