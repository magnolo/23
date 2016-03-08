<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    //
    protected $table = "categories";

    public function parent(){
      return $this->belongsTo('App\Categorie', 'parent_id');
    }
    public function indicators(){
      return $this->belongsToMany('App\Indicator', 'indicator_categories', 'categorie_id', 'indicator_id');
    }
    public function style(){
      return $this->belongsTo('App\Style', 'style_id');
    }
    public function children(){
      return $this->hasMany('App\Categorie', 'parent_id')->with('children','style','indicators');
    }
}
