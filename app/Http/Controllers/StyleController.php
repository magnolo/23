<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Style;

class StyleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return response()->api(Style::all());
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
        $style = new Style();
        $style->title = $request->input('title');
        $style->name = str_slug($request->input('title'));
        $style->base_color = $request->input('base_color');
        $style->basemap_id = $request->input('basemap_id');
        $style->fixed_title = $request->input('fixed_title');
        $style->fixed_description = $request->input('fixed_description');
        $style->search_box = $request->input('search_box');
        $style->share_options = $request->input('share_options');
        $style->zoom_controls = $request->input('zoom_controls');
        $style->scroll_wheel_zoom = $request->input('scroll_wheel_zoom');
        $style->layer_selection = $request->input('layer_selection');
        $style->legends = $request->input('legends');
        $style->full_screen = $request->input('full_screen');

        $status = $style->save();

        return response()->api($style);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $style = Style::findOrFail($id);
        return response()->api($style);
        //
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
        $style = Style::find($id);
        $style->title = $request->input('title');
        $style->name = str_slug($request->input('title'));
        $style->base_color = $request->input('base_color');
        $style->basemap_id = $request->input('basemap_id');
        $style->fixed_title = $request->input('fixed_title');
        $style->fixed_description = $request->input('fixed_description');
        $style->search_box = $request->input('search_box');
        $style->share_options = $request->input('share_options');
        $style->zoom_controls = $request->input('zoom_controls');
        $style->scroll_wheel_zoom = $request->input('scroll_wheel_zoom');
        $style->layer_selection = $request->input('layer_selection');
        $style->legends = $request->input('legends');
        $style->full_screen = $request->input('full_screen');

        return response()->api($style->save());
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
        $style = Style::find($id);
        $style->delete();
        return response()->api($style);
    }
}
