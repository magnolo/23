<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Basemap;

class BasemapController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return response()->api(Basemap::all());
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
        $basemap = new Basemap;
        $basemap->title = $request->get('title');
        $basemap->name = str_slug($request->get('title'));
        $basemap->url = $request->get('url');
        $basemap->description = $request->get('description');
        $basemap->attribution = $request->get('attribution');
        $basemap->provider = $request->get('provider');
        $basemap->image_id = $request->get('image_id');
        $basemap->is_public = $request->get('is_public');
        $basemap->ext = $request->get('ext');
        $basemap->key = $request->get('key');
        $basemap->bounds = $request->get('bounds');
        $basemap->maxZoom = $request->get('maxZoom');
        $basemap->minZoom = $request->get('minZoom');
        $basemap->subdomains = $request->get('subdomains');

        $basemap->save();

        return response()->api($basemap);
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
        $basemap = Basemap::findOrFail($id);
        return response()->api($basemap);
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
          $basemap = Basemap::findOrFail($id);
          $basemap->title = $request->get('title');
          $basemap->name = str_slug($request->get('title'));
          $basemap->url = $request->get('url');
          $basemap->description = $request->get('description');
          $basemap->attribution = $request->get('attribution');
          $basemap->provider = $request->get('provider');
          $basemap->image_id = $request->get('image_id');
          $basemap->is_public = $request->get('is_public');
          $basemap->ext = $request->get('ext');
          $basemap->key = $request->get('key');
          $basemap->bounds = $request->get('bounds');
          $basemap->maxZoom = $request->get('maxZoom');
          $basemap->minZoom = $request->get('minZoom');
          $basemap->subdomains = $request->get('subdomains');
          $basemap->save();

          return response()->api($basemap);
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
        $basemap = Basemap::findOrFail($id);
        return response()->api($basemap->delete());
    }
}
