<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Index;
use App\IndexItem;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class IndexController extends Controller
{
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
    public function calcValues($items, $year){
      foreach($items as $key => $item){
        if($item->is_group == false){
          $data = \DB::table($index->table)
            ->where('year', $year)
            ->leftJoin('countries_big', $item->table.".".$item->iso, '=', 'countries_big.adm0_a3')
            ->select($item->table.".*", 'countries_big.admin as country')
            ->orderBy($item->table.".".$item->score_field_name, 'desc')->get();
          $avg = $data = \DB::table($index->table)
              ->where('year', $year)
              ->avg($item->score_field_name);

          foreach ($data as $key => $value) {
            
          }
        }
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
          return $this->calcValues($data->children, $year);
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
