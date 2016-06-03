<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Export;
use Auth;

class ExportController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return response()->api(Export::with(['items', 'image'])->get());

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


        $export = new Export;
        $export->title = $request->get('title');
        $export->name = str_slug($request->get('title'));
        $export->url = $request->get('url');
        $export->image_id = $request->get('image_id');
        $export->description = $request->get('description');
        $export->business = $request->get('business');
        $export->usage = $request->get('usage');
        $export->user_id = Auth::user()->id;
        $export->layout_id = 0;
        $export->save();

        

        return response()->api($export);
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
        $export = Export::with(['items', 'image'])->where('id', $id)->firstOrFail();
        return response()->api($export);
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

        $export = Export::findOrFail($id);
        return response()->api($export->delete());
    }
}
