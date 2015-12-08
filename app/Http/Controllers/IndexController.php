<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Index;
use App\IndexItem;
use App\Style;
use App\Http\Requests;
use App\Http\Controllers\Controller;


use Auth;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class IndexController extends Controller
{
    protected $countries;
    protected $calced = array();
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return response()->api(Index::where('parent_id', 0)->get()->load('children'));
    }
    public function alphabethical(){
        return Index::orderBy('title', 'ASC')->get();
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */

    protected function saveSubIndex($data, $parent){
      foreach($data as $entry){
        $name = preg_replace('/\s[\s]+/','_',$parent->name.'-'.$entry['title']);    // Strip off multiple spaces
        $name = preg_replace('/[\s\W]+/','_',$name);    // Strip off spaces and non-alpha-numeric
        $name = preg_replace('/^[\-]+/','',$name); // Strip off the starting hyphens
        $name = preg_replace('/[\-]+$/','',$name); // // Strip off the ending hyphens
        $name = strtolower($name);
        //$isGroup = false;
        $table_name = '';
        //$iso = 'iso';
        //$color = '#006bb9';
        $icon = '';
        if(isset($entry['isGroup'])){
          $isGroup = true;
          $type_id = 1;
          $column = $name;
        }
        else{
          $type_id = 2;
          $table_name = $entry['table_name'];
          $column = $entry['column_name'];
          //$iso = $entry['iso'];
        }
        if(!isset($entry['color'])){
          $color = '#'.substr(md5(rand()), 0, 6);
        }
        else{
          $color = $entry['color'];
        }
        if(isset($entry['icon'])){
          $icon = $entry['icon'];
        }

        $index = new Index();
        $index->title = $entry['title'];
        $index->name = $entry['title'];
        $index->indicator_id = isset($entry['id']) ? $entry['id'] : null;
        $index->item_type_id = $type_id;
        $index->name = $name;
        $index->parent_id = $parent->id;
        $index->user_id = Auth::user()->id;
        $index->save();
        if($index->id && isset($entry['nodes'])){
          $this->saveSubIndex($entry['nodes'], $index);
        }
      }
    }
    public function create(Request $request)
    {
        //
        $name = preg_replace('/\s[\s]+/','_',$request->input('title'));    // Strip off multiple spaces
        $name = preg_replace('/[\s\W]+/','_',$name);    // Strip off spaces and non-alpha-numeric
        $name = preg_replace('/^[\-]+/','',$name); // Strip off the starting hyphens
        $name = preg_replace('/[\-]+$/','',$name); // // Strip off the ending hyphens
        $name = strtolower($name);

        $index = new Index();
        $index->title = $request->input('title');
        //$index->full_name = $request->input('title');
        //$index->table = '';
        //$index->is_group = true;
        $index->name = $name;
        $index->item_type_id = 1;
        //$index->iso = 'iso';
        $index->parent_id = 0;
        //$index->column_name = $name.'_score';
        //$index->score_field_name = $name.'_score';
        //$index->color = '#'.substr(md5(rand()), 0, 6);
        $index->user_id = Auth::user()->id;
        $index->save();

        if($index->id){
          $this->saveSubIndex($request->input('data'), $index);
        }
        return response()->api($index);
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

    public function show($id){
       if(is_int($id)){
           return response()->api(Index::find($id));
       }
       elseif(is_string($id)){
         return response()->api(Index::where('name', $id)->first());
       }
       return false;
    }
    public function showWithChildren($id)
    {
        $index = array();
        if(is_int($id)){
            $index = Index::find($id)->load('children');
        }
        elseif(is_string($id)){
          $index =  Index::where('name', $id)->first()->load('children');
        }
        $index->load('parent');

        return response()->api($index);
    }
    public function getLatestYear($index){
      return \DB::table($index->indicator->table_name)->max('year');
    }
    public function fetchData($index, $year){

      if(isset($index->children)){
        if(count($index->children)){
          foreach($index->children as $key => &$item){
            if($item->type->name != "group"){
              $data = \DB::table($item->indicator->table_name)
                ->where('year', $year)
                ->leftJoin('23_countries', $item->indicator->table_name.".".$item->indicator->iso_name, '=', '23_countries.adm0_a3')
                ->select($item->indicator->table_name.".".$item->indicator->column_name.' as score', $item->indicator->table_name.".year",'23_countries.adm0_a3 as iso','23_countries.admin as country')
                ->orderBy($item->indicator->table_name.".".$item->indicator->column_name, 'desc')->get();
              $item->data = $data;
            }
            if(count($item->children)){
                $item = $this->fetchData($item, $year);
            }
          }
        }
        else{
          
          $data = \DB::table($index->indicator->table_name)
            ->where('year', $year)
            ->leftJoin('23_countries', $index->indicator->table_name.".".$index->indicator->iso_name, '=', '23_countries.adm0_a3')
            ->select($index->indicator->table_name.".".$index->indicator->column_name.' as score', $index->indicator->table_name.".year",'23_countries.adm0_a3 as iso','23_countries.admin as country')
            ->orderBy($index->indicator->table_name.".".$index->indicator->column_name, 'desc')->get();
          $index->data = $data;
        }
      }
      return $index;
    }
    public function fetchDataForCountry($index, $iso){
      if(isset($index->children)){
        if(count($index->children)){
          foreach($index->children as $key => &$item){
            if($item->is_group == false){
              $item->load('indicator');
              $data = \DB::table($item->indicator->table_name)
                ->where($item->indicator->iso_name, $iso)
                ->select($item->indicator->column_name.' as score', $item->indicator->table_name.".year")
                ->orderBy('year', 'desc')->get();
              $item->data = $data;
            }
            if(count($item->children)){
                $item = $this->fetchDataForCountry($item, $iso);
            }
          }
        }
        else{
          $data = \DB::table($index->indicator->table_name)
            ->where($index->indicator->iso_name, $iso)
            ->select($index->indicator->column_name.' as score', $index->indicator->table_name.".year")
            ->orderBy('year', 'desc')->get();
          $index->data = $data;
        }
      }


      return $index;
    }
    public function calcAverage($item, $length, $name){

      foreach ($item as $key => &$country) {
        $calc[$name]['value'] = 0;
        foreach ($country as $k => $index) {
          if(isset($index['calc'])){
              if($index['calc']){
                $calc[$name]['value'] += floatval($index['value']);
              }
          }
          $country[$name]['year'] = $index['year'];
        }
        $country[$name]['value'] = $calc[$name]['value']/$length;
      }

      return $item;
    }
    public function averageDataForCountry($item){
      $sum = array();
      if(count($item['children'])){
        foreach($item['children'] as $child){
          if($child->type->name != 'group'){
              foreach($child['data'] as $data){
                if(!isset($sum[$data->year][$child->name])){
                  $sum[$data->year][$child->name]['value'] = 0;
                  $sum[$data->year][$child->name]['year'] = $data->year;
                  $sum[$data->year][$child->name]['calc'] = true;
                }
                $sum[$data->year][$child->name]['value'] += $data->score;
              }
          }
          else{
              $sub = $this->averageDataForCountry($child);
              $su = $this->calcAverage($sub, $this->fieldCount($sub), $child->name);
              foreach($su as $key => &$s){
                foreach($s as $k => &$dat){
                  $sum[$key][$k]['value'] = $dat['value'];
                  $sum[$key][$k]['year'] = $dat['year'];
                  $sum[$key][$k]['calc'] = false;
                  if($k == $child['score_field_name']){
                    $sum[$key][$k]['calc'] = true;
                  }
                }
              }
          }
        }
      }
      else{
        foreach($item['data'] as $data){
          if(!isset($sum[$data->year][$item->name])){
            $sum[$data->year][$item->name]['value'] = 0;
            $sum[$data->year][$item->name]['year'] = $data->year;
            $sum[$data->year][$item->name]['calc'] = true;
          }
          $sum[$data->year][$item->name]['value'] += $data->score;
        }
      }
      return $sum;
    }
    public function averageData($item){
      $sum = array();
      if(count($item['children'])){
        foreach($item['children'] as $child){
          $child->load('indicator');
          if(!$child->type->name != "group"){
            foreach($child->data as $data){
              if(!isset($sum[$data->iso][$child->name])){
                  $sum[$data->iso][$child->name]['value'] = 0;
                  $sum[$data->iso][$child->name]['year'] = $data->year;
                  $sum[$data->iso][$child->name]['calc'] = true;
                  //$sum[$data->iso]['country'] = $data->country;
              }
              $sum[$data->iso][$child->name]['value'] += $data->score;
            }
          }
          else{
            $sub = $this->averageData($child);
            $su = $this->calcAverage($sub, $this->fieldCount($sub),$child->name);
            foreach($su as $key => &$s){
              foreach($s as $k => &$dat){
                $sum[$key][$k]['value'] = $dat['value'];
                $sum[$key][$k]['year'] = $dat['year'];
                $sum[$key][$k]['calc'] = false;
                if($k == $child['column_name']){
                  $sum[$key][$k]['calc'] = true;
                }
              }
            }
          }
        }
      }
      else{
        foreach($item->data as $data){
          if(!isset($sum[$data->iso][$item->name])){
              $sum[$data->iso][$item->name]['value'] = 0;
              $sum[$data->iso][$item->name]['year'] = $data->year;
              $sum[$data->iso][$item->name]['calc'] = true;
              //$sum[$data->iso]['country'] = $data->country;
          }
          $sum[$data->iso][$item->name]['value'] += $data->score;
        }
      }
      return $sum;
    }
    public function fieldCount($items){
      $fields = array();
      foreach($items as $key => $item) {
        foreach($item as $k => $i){
          if($i['calc'] && !isset($fields[$k])){
            $fields[$k] = true;
          }
        }
      }
      return count($fields);
    }
    public function calcValuesForStatistic($index){
      $scores = $this->averageDataForCountry($index);
      $data = array();
      $scores = $this->calcAverage($scores, $this->fieldCount($scores), $index->name);
      foreach ($scores as $key => $value) {
        foreach($value as $k => $column){
          $entry[$k] = $column['value'];
        }
        $entry['year']  = $key;
        $data[] = $entry;
      }
      return $data;
    }
    public function calcValues($index){
      $data = array();
      if($index->type->name == "group"){
        $score = $this->averageData($index);
        $score = $this->calcAverage($score, $this->fieldCount($score), $index->name);
      }
      else{
        $score = $this->averageData($index);
      }
      foreach ($score as $key => $value) {
        $entry = [
          'iso' => $key
        ];
        foreach($value as $k => $column){
          $entry[$k] = $column['value'];
        }
        $data[] = $entry;
      }
      return $data;
    }
    public function showByIso($id, $iso){
      if(is_int($id)){
        $index = Index::findOrFail($id)->load('type');
      }
      elseif(is_string($id)){
        $index = Index::where('name', $id)->firstOrFail()->load('type');
      }
      //if($index->type->name == 'group'){
        $data = $index->load('children');
        $response = [
           'iso' => $iso,
           'data' => $this->calcValuesForStatistic($this->fetchDataForCountry($data, $iso))
        ];
        //return response()->api($this->fetchDataForCountry($data, $iso));
        return response()->api($response);
      /*}
      else{
        return response()->api(Nation::all()->load('epi'));
      }*/
    }
    public function showByYear($id, $year)
    {
        if(is_int($id)){
          $index = Index::find($id)->with('type');
        }
        elseif(is_string($id)){
          $index = Index::where('name', $id)->firstOrFail()->load('type');
        }
        $data = $index->load('children');
        $data =  $this->calcValues($this->fetchData($data, $year));
        return response()->api($data);
    }
    public function showLatestYear($id)
    {
        if(is_int($id)){
          $index = Index::find($id)->with('type');
        }
        elseif(is_string($id)){
          $index = Index::where('name', $id)->firstOrFail()->load('type');
        }
        $data = $index->load('children');
        $year = '';
        if($index->type->name == 'group'){
          foreach($data->children as $child){
            if($child->type->name != 'group'){
              $year = $this->getLatestYear($child);
            }
          }
        }
        else{
          $year = $this->getLatestYear($index);
        }

        $data =  $this->calcValues($this->fetchData($data, $year));
        return response()->api($data);
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
