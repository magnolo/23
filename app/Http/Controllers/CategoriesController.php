<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Categorie;

use Auth;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return response()->api(Categorie::all()->load('style'));
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
        $name = str_slug($request->input('title'), '-');
        $cat = Categorie::where('name',$name)->first();
        if($cat){
          return response()->json(['error' => 'Categorie with this name already exists'], 500);
        }
        else{
          $user = Auth::user();
          $parent = $request->input('parent');//
          $parent_id = 0;
          if($parent){
            $parent_id = $parent['id'];
          }

          $category = new Categorie;
          $category->title = $request->input('title');
          $category->name = $name;
          $category->is_public = $request->input('is_public');
          $category->description = $request->input('description');
          $category->parent_id = $parent_id;
          $category->user_id = $user->id;
          $category->save();
        }


        return response()->api($category);

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
        return response()->api(Categorie::where('name', $id)->firstOrFail());
    }
    public function showWithIndicators($id){

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
}
