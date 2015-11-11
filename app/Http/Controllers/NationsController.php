<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Nation;

class NationsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
        return response()->api(Nation::all()->load('epi'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($iso)
    {
        //
        return response()->api(Nation::where('iso', strtoupper($iso))->first()->load('epi'));
    }
    public function getByName($name){
      $nation =  \DB::table('countries_big')
        ->select('iso_a3 as iso', 'name', 'name_long', 'admin')
        ->where('admin', 'like', '%'.$name.'%')
        ->orWhere('geounit', 'like', '%'.$name.'%')
        ->orWhere('name', 'like', '%'.$name.'%')
        ->orWhere('name_long', 'like', '%'.$name.'%')
        ->orWhere('brk_name', 'like', '%'.$name.'%')
        ->orWhere('formal_en', 'like', '%'.$name.'%')
        ->get();
        return response()->api($nation);
    }
    public function getByIsos($isos){
      foreach($names as $name){
        $nation['name'] =  \DB::table('countries_big')
          ->select('iso_a3 as iso', 'name', 'name_long', 'admin')
          ->where('admin', 'like', '%'.$name.'%')
          ->orWhere('geounit', 'like', '%'.$name.'%')
          ->orWhere('name', 'like', '%'.$name.'%')
          ->orWhere('name_long', 'like', '%'.$name.'%')
          ->orWhere('brk_name', 'like', '%'.$name.'%')
          ->orWhere('formal_en', 'like', '%'.$name.'%')
          ->get();
      }

        return response()->api($nation);
    }
    public function getBBox($countries){
 
        $box =  \DB::table('countries_big')->select(\DB::raw('st_asgeojson(St_envelope(ST_Union(geom))) as bbox'))->whereIn('iso_a3', explode(",",$countries))->first();
        return $box->bbox;
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }
}
