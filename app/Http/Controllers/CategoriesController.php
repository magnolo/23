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
        $with = ['style'];
        $tree = false;
        if(\Input::has('indicators')){
          if(\Input::get('indicators') == true){
            $with = ['style', 'indicators'];
          }
        }
        if(\Input::has('tree')){
          if(\Input::get('tree') == true){
            $with = ['style', 'indicators', 'children'];
            $tree = true;
          }
        }
        $categories = Categorie::with($with)->orderBy('title');
        if($tree){
          $categories = $categories->where('parent_id', 0);
        }
        return response()->api($categories->get());
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
        $name = str_slug($request->input('title'));
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
          $category->is_public = $request->input('is_public') ? $request->input('is_public') : false;
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
        return response()->api(Categorie::where('name', $id)->with('style', 'parent', 'children')->firstOrFail());
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
        $categorie = Categorie::find($id);
        $categorie->title = $request->input('title');
        $categorie->name = str_slug($request->input('title'));
        $categorie->parent_id = $request->input('parent_id');
        $categorie->style_id = $request->input('style_id');
        $categorie->is_public = $request->input('is_public');
        $categorie->description = $request->input('description');

        return response()->api($categorie->save());
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
          $categorie = Categorie::find($id);
          $this->deleteChildren($categorie);
          $categorie->delete();
          return response()->api($categorie);
    }
    public function deleteChildren($item){
      if(count($item->children) > 0){
        foreach ($item->children as $key => $child) {
          if(count($child->children) > 0 ){
            $this->deleteChildren($child);
          }
          Categorie::find($child->id)->delete();
        }
      }
    }
}
