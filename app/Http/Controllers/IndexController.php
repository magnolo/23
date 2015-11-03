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
        //
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
           return Index::find($id);
       }
       elseif(is_string($id)){
         return Index::where('name', $id)->first();
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

        return $index;
    }

    public function showByYear($id, $year)
    {
        //
        $index = $this->show($id);
        $data = \DB::table($index->table)->where('year', $year)->orderBy($index->score_field_name, 'desc')->get();
        return \Response::json($data, 200, [], JSON_NUMERIC_CHECK);
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
