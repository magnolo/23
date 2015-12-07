<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Index;
use App\IndexItem;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Nation;
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
        $isGroup = false;
        $table_name = '';
        $iso = 'iso';
        $color = '#006bb9';
        $icon = '';
        if(isset($entry['isGroup'])){
          $isGroup = true;
          $column = $name;
        }
        else{
          $table_name = $entry['table_name'];
          $column = $entry['column'];
          $iso = $entry['iso'];
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
        $index->full_name = $entry['title'];
        $index->table = $table_name;
        $index->is_group = $isGroup;
        $index->name = $name;
        $index->iso = $iso;
        $index->parent_id = $parent->id;
        $index->column_name = $column;
        $index->score_field_name = $column;
        $index->color = $color;
        $index->icon = $icon;
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
        if($index->is_group){
          $index->score_field_name = 'score';
        }
        $index->load('parent');

        return response()->api($index);
    }
    public function fetchData($index, $year){
      if(isset($index->children)){
        if(count($index->children)){
          foreach($index->children as $key => &$item){
            if($item->is_group == false){
              $data = \DB::table($item->table)
                ->where('year', $year)
                ->leftJoin('23_countries', $item->table.".".$item->iso, '=', '23_countries.adm0_a3')
                ->select($item->table.".".$item->score_field_name.' as score', $item->table.".year",'23_countries.adm0_a3 as iso','23_countries.admin as country')
                ->orderBy($item->table.".".$item->score_field_name, 'desc')->get();
              $item->data = $data;
            }
            if(count($item->children)){
                $item = $this->fetchData($item, $year);
            }
          }
        }
      }
      return $index;
    }
    public function fetchDataForCountry($index, $iso){
      if(isset($index->children)){
        if(count($index->children)){
          foreach($index->children as $key => &$item){
            if($item->is_group == false){
              $data = \DB::table($item->table)
                ->where($item->iso, $iso)
                ->select($item->score_field_name.' as score', $item->table.".year")
                ->orderBy('year', 'desc')->get();
              $item->data = $data;
            }
            if(count($item->children)){
                $item = $this->fetchDataForCountry($item, $iso);
            }
          }
        }
      }
      return $index;
    }
    public function calcAverage($item, $length, $name){
      foreach ($item as $key => &$country) {
        $country[$name]['value'] = 0;
        foreach ($country as $k => $index) {
          if(isset($index['calc'])){
              if($index['calc']){
                $country[$name]['value'] += floatval($index['value']);
              }
          }
          $country[$name]['year'] = $index['year'];
        }
        $country[$name]['value'] = $country[$name]['value']/$length;
      }
      return $item;
    }
    public function averageDataForCountry($item){
      $sum = array();
      foreach($item['children'] as $child){
        if(!$child['is_group']){
            foreach($child['data'] as $data){
              if(!isset($sum[$data->year][$child['score_field_name']])){
                $sum[$data->year][$child['score_field_name']]['value'] = 0;
                $sum[$data->year][$child['score_field_name']]['year'] = $data->year;
                $sum[$data->year][$child['score_field_name']]['calc'] = true;
              }
              $sum[$data->year][$child['score_field_name']]['value'] += $data->score;
            }
        }
        else{
            $sub = $this->averageDataForCountry($child);
            $su = $this->calcAverage($sub, $this->fieldCount($sub), $child['score_field_name']);
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
      return $sum;
    }
    public function averageData($item){
      $sum = array();
      foreach($item['children'] as $child){
        if(!$child['is_group']){
          foreach($child['data'] as $data){
            if(!isset($sum[$data->iso][$child['score_field_name']])){
                $sum[$data->iso][$child['score_field_name']]['value'] = 0;
                $sum[$data->iso][$child['score_field_name']]['year'] = $data->year;
                $sum[$data->iso][$child['score_field_name']]['calc'] = true;
                //$sum[$data->iso]['country'] = $data->country;
            }
            $sum[$data->iso][$child['score_field_name']]['value'] += $data->score;
          }
        }
        else{
          $sub = $this->averageData($child);
          $su = $this->calcAverage($sub, $this->fieldCount($sub), $child['score_field_name']);
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
      $scores = $this->calcAverage($scores, $this->fieldCount($scores), 'score');
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
      if($index['is_group']){
        $score = $this->averageData($index);
      }
      $data = array();
      //return $score;
      $score = $this->calcAverage($score, $this->fieldCount($score), 'score');
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
        $index = Index::find($id);
      }
      elseif(is_string($id)){
        $index = Index::where('name', $id)->first();
      }
      if($index->is_group){
        $data = $index->load('children');
        $response = [
           'iso' => $iso,
           'data' => $this->calcValuesForStatistic($this->fetchDataForCountry($data, $iso)->toArray())
        ];
        return response()->api($response);
      }
      else{
        return response()->api(Nation::all()->load('epi'));
      }
    }
    public function showByYear($id, $year)
    {
        //
        if(is_int($id)){
          $index = Index::find($id);
        }
        elseif(is_string($id)){
          $index = Index::where('name', $id)->firstOrFail();
        }

          if($index->is_group){
            $data = $index->load('children');
            return $this->calcValues($this->fetchData($data, $year)->toArray());
          }
          else{
            $data = \DB::table($index->table)
              ->where('year', $year)
              ->leftJoin('23_countries', $index->table.".".$index->iso, '=', '23_countries.adm0_a3')
              ->select($index->table.".*", '23_countries.admin as country')
              ->orderBy($index->table.".".$index->score_field_name, 'desc')->get();

            $sub = Index::where('parent_id', $index->id)->get();
            foreach($sub as $subIndex){
              if($subIndex->table != $index->table){
                  $subData = \DB::table($subIndex->table)->where('year', $year)->select($subIndex->score_field_name, $subIndex->iso)->get();
                  foreach($data as &$d){
                    foreach($subData as $sd){
                      if($sd->{$subIndex->iso} == $d->{$index->iso}){
                        $d->{$subIndex->score_field_name} = $sd->{$subIndex->score_field_name};
                      }
                    }
                  }
              }
            }
          }

        return \Response::json($data, 200, [], JSON_NUMERIC_CHECK);
        //return response()->api($data);
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
