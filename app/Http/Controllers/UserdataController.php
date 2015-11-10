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

use Illuminate\Database\Schema\Blueprint;

class UserdataController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

     public function __construct(){
        //$this->middleware('jwt.auth');

     }
    public function index()
    {
        //
        return response()->api(UserData::all()->load('user'));
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
      $name = preg_replace('/\s[\s]+/','-',$request->input('name'));    // Strip off multiple spaces
      $name = preg_replace('/[\s\W]+/','-',$name);    // Strip off spaces and non-alpha-numeric
      $name = preg_replace('/^[\-]+/','',$name); // Strip off the starting hyphens
      $name = preg_replace('/[\-]+$/','',$name); // // Strip off the ending hyphens
      $name = strtolower($name);
      $request->input('name');
      $data['table_name'] = $name;
      $data['db'] = \Schema::create('user_table_'.$name, function(Blueprint $table) use ($request){
        $table->increments('id');
        $table->string($request->input('iso_field'));

        foreach($request->input('fields') as $field){
          if($field != $request->input('iso_field') && $field != 'year'){
            $table->string($field);
          }
        }
        $table->integer('year');
      });
      return response()->api($data);
    }
}
