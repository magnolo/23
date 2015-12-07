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
        return response()->api(Indicator::all());
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
          $data = \DB::table('user_table_'.$table)->insert($chunk);
      }
      return response()->api($data);
    }
    public function createDataTable(Request $request){
      $data = array();
      $name = preg_replace('/\s[\s]+/','_',$request->input('name'));    // Strip off multiple spaces
      $name = preg_replace('/[\s\W]+/','_',$name);    // Strip off spaces and non-alpha-numeric
      $name = preg_replace('/^[\-]+/','',$name); // Strip off the starting hyphens
      $name = preg_replace('/[\-]+$/','',$name); // // Strip off the ending hyphens
      $name = strtolower($name);
      //dd(strtolower($name));
      $data['table_name'] = $name;

      \DB::transaction(function () use ($request, $name, &$data) {
      $data['db'] = \Schema::create('user_table_'.$name, function(Blueprint $table) use ($request){
        $table->increments('id');
        $table->string($request->input('iso_field'));
        if($request->input('country_field') != ''){
            $table->string($request->input('country_field'));
        }
        foreach($request->input('fields') as $field){
          if($field != 'year'){
            $table->string($field['column'])->nullable();
          }
        }
        $table->integer('year');
      });

      $user = Auth::user();
      $data['userdata_id'] = UserData::insertGetId([
        'user_id' => $user->id,
        'dataprovider_id' => $request->input('dataprovider_id'),
        'table_name' => 'user_table_'.$name,
        'name' => $name,
        'title' => $request->input('name'),
        'description' => $request->input('description'),
        'caption' => $request->input('caption'),
        'meta_data' => json_encode($request->input('fields')),
        'is_public' => 0,
        'is_api' => 0,
        'created_at' => 'NOW()',
        'updated_at' => 'NOW()',
        'iso_name' => $request->input('iso_field')
        ]
      );

      foreach($request->input('fields') as $field){
        $indicator = new Indicator;
        $indicator->column_name = $field['column'];
        $indicator->userdata_id = $data['userdata_id'];
        $indicator->title = $field['title'];
        $indicator->name = $field['title'];
        $indicator->type = $field['type'];
        $indicator->measure_type_id = $field['measure_type_id'];
        $indicator->table_name = 'user_table_'.$name;
        $indicator->iso_name = $request->input('iso_field');
        $indicator->is_public = $field['is_public'];
        $indicator->is_official = false;
        $data['indicators'][] = $indicator->save();
      }
    });
      return response()->api($data);
    }
}
