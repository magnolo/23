<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use DB;
use App\Countrie;
use App\Indicator;

class CountriesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $countries = Countrie::select('iso_a2 as iso', 'admin as country')->get();
        return response()->api($countries);
    }
    public function isoList(){
      $countries =  Countrie::select('iso_a2 as iso', 'admin as country')->get();
      $data = array();
      foreach ($countries as $key => $country) {
        if($country->iso != -99){
          $data[$country->iso] = $country->country;
        }

      }
      return response()->api($data);
    }
    public function getBBox($countries){

        $box =  Countrie::select(\DB::raw('st_asgeojson(St_envelope(ST_Union(geom::geometry))) as bbox'))->whereIn('iso_a2', explode(",",$countries))->first();

        return response()->api(json_decode($box->bbox));
    }

    public function getByIsoNames(Request $request){
      $data = array();
      $iso_field = $request->input('iso') == "iso-3166-2" ? 'iso_a2' : "adm0_a3";
      foreach($request->input('data') as $entry){
        if($entry['iso'] == '' || $entry['iso'] == null){
          $country = Countrie::select('iso_a3 as iso3',  'iso_a2 as iso', 'name', 'name_long', 'admin','formal_en','brk_name','geounit')
            ->where('admin', 'like', '%'.$entry['name'].'%')
            ->orWhere('geounit', 'like', '%'.$entry['name'].'%')
            ->orWhere('name', 'like', '%'.$entry['name'].'%')
            ->orWhere('name_long', 'like', '%'.$entry['name'].'%')
            ->orWhere('brk_name', 'like', '%'.$entry['name'].'%')
            ->orWhere('formal_en', 'like', '%'.$entry['name'].'%')
            ->get();
            //  $data[$country[0]->iso] = $country;
        }
        else{
            $country = Countrie::select('iso_a3 as iso3','iso_a2 as iso', 'name', 'name_long', 'admin','formal_en','brk_name','geounit')
              ->where($iso_field, 'like', '%'.$entry['iso'].'%')
              ->get();
        }

        if(count($country) < 1){
          if($entry['iso'] != ''){
            $country = Countrie::select('iso_a3 as iso3', 'iso_a2 as iso', 'name', 'name_long', 'admin','formal_en','brk_name','geounit')
              ->where('admin', 'like', '%'.$entry['name'].'%')
              ->orWhere('geounit', 'like', '%'.$entry['name'].'%')
              ->orWhere('name', 'like', '%'.$entry['name'].'%')
              ->orWhere('name_long', 'like', '%'.$entry['name'].'%')
              ->orWhere('brk_name', 'like', '%'.$entry['name'].'%')
              ->orWhere('formal_en', 'like', '%'.$entry['name'].'%')
              ->get();
          }
        }
        $d = [
          'name' => $entry['name'],
          'iso' => $entry['iso'],
          'data' => $country

        ];
        $data[] = $d;

      }

      return response()->api($data);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($iso, Request $request)
    {
        //

        if(strlen($iso) == 3){
          $countrie = Countrie::where('adm0_a3', strtoupper($iso))->first();
        }
        else{
          if($request->has('simple')){
            $countrie =  Countrie::select('iso_a3 as iso', 'name', 'name_long', 'admin')
              ->where('admin', 'like', '%'.$iso.'%')
              ->orWhere('geounit', 'like', '%'.$iso.'%')
              ->orWhere('name', 'like', '%'.$iso.'%')
              ->orWhere('name_long', 'like', '%'.$iso.'%')
              ->orWhere('brk_name', 'like', '%'.$iso.'%')
              ->orWhere('formal_en', 'like', '%'.$iso.'%')
              ->first();
          }
          else{
            $countrie =  Countrie::where('admin', 'like', '%'.$iso.'%')
              ->orWhere('geounit', 'like', '%'.$iso.'%')
              ->orWhere('name', 'like', '%'.$iso.'%')
              ->orWhere('name_long', 'like', '%'.$iso.'%')
              ->orWhere('brk_name', 'like', '%'.$iso.'%')
              ->orWhere('formal_en', 'like', '%'.$iso.'%')
              ->first();
          }

        }
        return response()->api($countrie);
      }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function getContinents(Request $request){
      $continents = DB::table('countries')
        ->select('continent as title')
        ->groupBy('continent')
        ->get();

      if($request->has('indicator')){
        $indicator = Indicator::find($request->get('indicator'));
        $iso_field = $indicator->userdata->iso_type == 'iso-3166-1' ? 'adm0_a3': 'iso_a2';
        $data = \DB::table($indicator->table_name)
          ->where('year', \DB::raw('(select MAX(tt_'.$indicator->table_name.'.year) from tt_'.$indicator->table_name.')'))
          ->where($indicator->table_name.".".$indicator->column_name, '<>', null)
          ->select($indicator->iso_name.' as iso')
          ->get();

        $isos = array();
        foreach($data as $country){
          $isos[] = $country->iso;
        }
      }
      $conts = array();
      foreach($continents as $key => &$continent){
        $continent->id = ($key+1) *1000;
        if($request->has('indicator')){
          $continent->children = Countrie::select('id', 'admin as title', 'iso_a2', 'iso_a3')
            ->where('continent', $continent->title)
            ->where('iso_a2', '<>', 99)
            ->where('iso_a2', '<>', -99)
            ->whereIn('iso_a2', $isos)
            ->orderBy('title')
            ->get();

        }
        else{
          $continent->children = Countrie::select('id', 'admin as title', 'iso_a2', 'iso_a3')->where('continent', $continent->title)->where('iso_a2', '<>', 99)->where('iso_a2', '<>', -99)->orderBy('title')->get();
        }
        if(count($continent->children) > 0){
          $conts[] = $continent;
        }
      }
      return response()->api($conts);
    }
}
