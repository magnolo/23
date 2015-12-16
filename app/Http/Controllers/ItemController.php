<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Item;
use App\Style;
use App\Http\Requests;
use App\Http\Controllers\Controller;


use Auth;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class ItemController extends Controller
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
        return response()->api(Item::where('parent_id', 0)->get()->load('children'));
    }
    public function alphabethical(){
        return Item::orderBy('title', 'ASC')->get();
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

        $item = new Item();
        $item->title = $entry['title'];
        $item->name = $entry['title'];
        $item->indicator_id = isset($entry['id']) ? $entry['id'] : null;
        $item->item_type_id = $type_id;
        $item->name = $name;
        $item->parent_id = $parent->id;
        $item->user_id = Auth::user()->id;
        $item->save();
        if($item->id && isset($entry['nodes'])){
          $this->saveSubIndex($entry['nodes'], $item);
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

        $item = new Item();
        $item->title = $request->input('title');
        $item->name = $name;
        $item->item_type_id = 1;
        $item->parent_id = 0;
        $item->user_id = Auth::user()->id;
        $item->save();

        if($item->id){
          $this->saveSubIndex($request->input('data'), $item);
        }
        return response()->api($item);
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
           return response()->api(Item::find($id));
       }
       elseif(is_string($id)){
         return response()->api(Item::where('name', $id)->first());
       }
       return false;
    }
    public function showWithChildren($id)
    {
        $item = array();
        if(is_int($id)){
            $item = Item::find($id)->load('children');
        }
        elseif(is_string($id)){
          $item =  Item::where('name', $id)->first()->load('children');
        }
        $item->load('parent');

        return response()->api($item);
    }
    public function getLatestYear($item){
      return \DB::table($item->indicator->table_name)->max('year');
    }
    public function fetchData($item, $year){

      if(isset($item->children)){
        if(count($item->children)){
          foreach($item->children as $key => &$item){
            if($item->type->name != "group"){
              $item->indicator->load('userdata');
              $iso_field = $item->indicator->userdata->iso_type == 'iso-3166-1' ? 'adm0_a3': 'iso_a2';
              $data = \DB::table($item->indicator->table_name)
                ->where('year', $year)
                ->leftJoin('23_countries', $item->indicator->table_name.".".$item->indicator->iso_name, '=', '23_countries.'.$iso_field)
                ->select($item->indicator->table_name.".".$item->indicator->column_name.' as score', $item->indicator->table_name.".year",'23_countries.'.$iso_field.' as iso','23_countries.admin as country')
                ->orderBy($item->indicator->table_name.".".$item->indicator->column_name, 'desc')->get();
              $item->data = $data;
            }
            if(count($item->children)){
                $item = $this->fetchData($item, $year);
            }
          }
        }
        else{
          $item->indicator->load('userdata');
          $iso_field = $item->indicator->userdata->iso_type == 'iso-3166-1' ? 'adm0_a3': 'iso_a2';
          $data = \DB::table($item->indicator->table_name)
            ->where('year', $year)
            ->leftJoin('23_countries', $item->indicator->table_name.".".$item->indicator->iso_name, '=', '23_countries.'.$iso_field)
            ->select($item->indicator->table_name.".".$item->indicator->column_name.' as score', $item->indicator->table_name.".year",'23_countries.'.$iso_field.' as iso','23_countries.admin as country')
            ->orderBy($item->indicator->table_name.".".$item->indicator->column_name, 'desc')->get();
          $item->data = $data;
        }
      }
      return $item;
    }
    public function fetchDataForCountry($item, $iso){
      if(isset($item->children)){
        if(count($item->children)){
          foreach($item->children as $key => &$item){
            if($item->type->name != "group"){
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
          $data = \DB::table($item->indicator->table_name)
            ->where($item->indicator->iso_name, $iso)
            ->select($item->indicator->column_name.' as score', $item->indicator->table_name.".year")
            ->orderBy('year', 'desc')->get();
          $item->data = $data;
        }
      }


      return $item;
    }
    public function calcAverage($item, $length, $name){

      foreach ($item as $key => &$country) {
        $calc[$name]['value'] = 0;
        foreach ($country as $k => $item) {
          if(isset($item['calc'])){
              if($item['calc']){
                $calc[$name]['value'] += floatval($item['value']);
              }
          }
          $country[$name]['year'] = $item['year'];
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
          if(!$child->type->name != "group" && isset($child->data)){
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
    public function calcValuesForStatistic($item){
      $scores = $this->averageDataForCountry($item);
      $data = array();
      $scores = $this->calcAverage($scores, $this->fieldCount($scores), $item->name);
      foreach ($scores as $key => $value) {
        foreach($value as $k => $column){
          $entry[$k] = $column['value'];
        }
        $entry['year']  = $key;
        $data[] = $entry;
      }
      return $data;
    }
    public function calcValues($item){
      $data = array();
      if($item->type->name == "group"){
        $score = $this->averageData($item);
        $score = $this->calcAverage($score, $this->fieldCount($score), $item->name);
      }
      else{
        $score = $this->averageData($item);
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
        $item = Item::findOrFail($id)->load('type');
      }
      elseif(is_string($id)){
        $item = Item::where('name', $id)->firstOrFail()->load('type');
      }
        $data = $item->load('children');
        $response = [
           'iso' => $iso,
           'data' => $this->calcValuesForStatistic($this->fetchDataForCountry($data, $iso))
        ];
        return response()->api($response);
    }
    public function showByYear($id, $year)
    {
        if(is_int($id)){
          $item = Item::find($id)->with('type');
        }
        elseif(is_string($id)){
          $item = Item::where('name', $id)->firstOrFail()->load('type');
        }
        $data = $item->load('children');
        $data =  $this->calcValues($this->fetchData($data, $year));
        return response()->api($data);
    }
    public function showLatestYear($id)
    {
        if(is_int($id)){
          $item = Item::find($id)->with('type');
        }
        elseif(is_string($id)){
          $item = Item::where('name', $id)->firstOrFail()->load('type');
        }
        $data = $item->load('children');
        $year = '';
        if($item->type->name == 'group'){
          foreach($data->children as $child){
            if($child->type->name != 'group'){
              $year = $this->getLatestYear($child);
            }
          }
        }
        else{
          $year = $this->getLatestYear($item);
        }
        //return response()->api($this->fetchData($data, $year));
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
