<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Index;
use App\IndexItem;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Nation;

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
                ->leftJoin('countries_big', $item->table.".".$item->iso, '=', 'countries_big.adm0_a3')
                ->select($item->table.".".$item->score_field_name.' as score', $item->table.".year",'countries_big.adm0_a3 as iso','countries_big.admin as country')
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
              if(!isset($sum[$data->year][$child['name']])){
                $sum[$data->year][$child['name']]['value'] = 0;
                $sum[$data->year][$child['name']]['year'] = $data->year;
                $sum[$data->year][$child['name']]['calc'] = true;
              }
              $sum[$data->year][$child['name']]['value'] += $data->score;
            }
        }
        else{
            $sub = $this->averageDataForCountry($child);
            $su = $this->calcAverage($sub, $this->fieldCount($sub), $child['name']);
            foreach($su as $key => &$s){
              foreach($s as $k => &$dat){
                $sum[$key][$k]['value'] = $dat['value'];
                $sum[$key][$k]['year'] = $dat['year'];
                $sum[$key][$k]['calc'] = false;
                if($k == $child['name']){
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
            }
            $sum[$data->iso][$child['score_field_name']]['value'] += $data->score;
          }
        }
        else{
          $sub = $this->averageData($child);
          $su = $this->calcAverage($sub, $this->fieldCount($sub), $child['name']);
          foreach($su as $key => &$s){
            foreach($s as $k => &$dat){
              $sum[$key][$k]['value'] = $dat['value'];
              $sum[$key][$k]['year'] = $dat['year'];
              $sum[$key][$k]['calc'] = false;
              if($k == $child['name']){
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
    }
    public function showByYear($id, $year)
    {
        //
        if(is_int($id)){
          $index = Index::find($id);
        }
        elseif(is_string($id)){
          $index = Index::where('name', $id)->first();
        }
        if($index->is_group){
          $data = $index->load('children');
          return $this->calcValues($this->fetchData($data, $year)->toArray());
        }
        else{
          $data = \DB::table($index->table)
            ->where('year', $year)
            ->leftJoin('countries_big', $index->table.".".$index->iso, '=', 'countries_big.adm0_a3')
            ->select($index->table.".*", 'countries_big.admin as country')
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

        /*foreach($data as &$d){
            dd($d->{$index->iso});
            if($subIndex->table != $index->table){
              $subData = \DB::table($subIndex->table)
                ->where($subIndex->iso, $d->{$index->iso})
                ->where('year', $year)
                ->select($subIndex->score_field_name)->first();
                $data = $subData;
              //$d->{$subIndex->score_field_name} = $subData->{$subIndex->score_field_name};
            }
          }*/




        //$data->{'hello'} = 'hello';
        //return $data;
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
