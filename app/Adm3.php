<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Adm3 extends Model
{
    protected $hidden = ['geom'];
    protected $fillable = ['hasc_2_d'];
    protected $table = 'adm3';
    public $timestamps = false;
}
