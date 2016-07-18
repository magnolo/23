<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Style extends Model
{
    //
    protected $table="styles";

    public function indicators(){
      return $this->hasMany('App\Indicator');
    }
    public function categories(){
      return $this->hasMany('App\Categorie');
    }
    public function basemap(){
      return $this->belongsTo('App\Basemap');
    }
    public function image(){
      return $this->belongsTo('App\Image');
    }
    public function countries(){
      return $this->belongsToMany('App\Countrie', 'style_countries', 'style_id', 'country_id');
    }
}
