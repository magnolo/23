<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\UserData;
use Auth;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\User;
use App\Indicator;
use App\Categorie;

use Illuminate\Database\Schema\Blueprint;



class UserdataController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index()
    {
        //v
        return response()->api(Indicator::all()->load('userdata'));
        /*  $data = array();
          $tables = UserData::all();
          foreach($tables as $table){
            $meta = json_decode($table->meta_data);
            foreach($meta as $source){
              $d = ['title' => $source->title, 'table_name' => $table->table_name, 'column' => $source->column, 'iso' => $table->iso_name];
              if(isset($source->description)){
                $d['description'] = $source->description;
              }
              $data[] = $d;
            }
          }

          $data = array_values(array_sort($data, function($value){
            return $value['title'];
          }));
          return $data;*/
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function indexWithUser(){
        return response()->api(UserData::all()->load('user'));
    }
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
    public function show($id)
    {
        //
        return reponse()->api(UserData::find($id)->load('indizes'));
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

    public function insertDataToTable($table, Request $request){
      $dataChunks = array_chunk($request->input('data'), 100);
      $data = array();
      foreach($dataChunks as $chunk) {
          foreach($chunk as &$item){
            foreach($item as $key => &$field){
              if(is_null($field) || $field == ''){
                $field = null;
              }
              if(is_numeric(str_replace(',', '.',$field))){
                $field = floatval(str_replace(',', '.',$field));
              }
            }
          }
          $data = \DB::table($table)->insert($chunk);
      }
      return response()->api($data);
    }
    public function createDataTable(Request $request){
      $data = array();
      $user = Auth::user();
      $name = $user->id."_".substr(md5(time()), 0, 8);
      //dd(strtolower($name));
      $data['table_name'] = 'user_table_'.$name;

      \DB::transaction(function () use ($request, $name, &$data, $user) {
      $data['db'] = \Schema::create('user_table_'.$name, function(Blueprint $table) use ($request){
        $table->increments('id');
        $table->string($request->input('iso_field'));
        if($request->input('country_field') != ''){
            $table->string($request->input('country_field'));
        }
        foreach($request->input('fields') as $field){
          if($field != 'year'){
            $table->float($field['column'])->nullable();
          }
        }
        $table->integer('year');
      });


      $data['userdata_id'] = UserData::insertGetId([
        'user_id' => $user->id,
        'table_name' => 'user_table_'.$name,
        'name' => $name,
        'title' => $name, //$request->input('name'),
        'description' => $request->input('description'),
        'caption' => $request->input('caption'),
        'meta_data' => json_encode($request->input('fields')),
        'is_public' => 0,
        'is_api' => 0,
        'created_at' => 'NOW()',
        'updated_at' => 'NOW()',
        'iso_name' => $request->input('iso_field'),
        'iso_type' =>  $request->input('iso_type'),
        'country_name' => $request->input('country_field')
        ]
      );

      foreach($request->input('fields') as $field){
        $indicator = new Indicator;
        $indicator->column_name = $field['column'];
        $indicator->userdata_id = $data['userdata_id'];
        $indicator->dataprovider_id = $field['dataprovider_id'];
        $indicator->title = $field['title'];
        $indicator->name = str_slug($field['title']);
        $indicator->measure_type_id = $field['measure_type_id'];
        $indicator->table_name = 'user_table_'.$name;
        $indicator->iso_name = $request->input('iso_field');
        $indicator->is_public = $field['is_public'];
        $indicator->style_id = isset($field['style_id']) ? $field['style_id'] : null;
        $indicator->is_official = false;
        $data['indicators'][] = $indicator->save();

        if(isset($field['categories'])){
          foreach($field['categories'] as $cat){
            $indicator->categories()->attach($cat);
          }
        }
      }
    });
      return response()->api($data);
    }
}
