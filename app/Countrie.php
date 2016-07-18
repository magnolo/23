<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Countrie extends Model
{
    //
    protected $hidden = ['geom'];

    protected $table="countries";


}
