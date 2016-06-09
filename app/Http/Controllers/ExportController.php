<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Export;
use App\Exportitem;
use Auth;
use DB;
use App\Style;


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
        DB::beginTransaction();

        $export = Export::findOrFail($id);
        $export->title = $request->get('title');
        $export->description = $request->get('description');
        $export->save();

        foreach($export->items() as $item){
          $item->style()->delete();
          Style::find($item->style_id)->delete();
        }
        $export->items()->delete();

        foreach($request->get('items') as $item){
            $exportitem = new Exportitem;
            $exportitem->type = $item['type'];
            $exportitem->title = $item['title'];
            if($item['type'] == "indicator"){
              $exportitem->indicator_id = $item['indicator_id'];
            }
            if($item['style']){

              $style = new Style;
              $style->title = "Export: ".$request->get('title');
              $style->name = str_slug($style->title);
              $style->basemap_id = $item['style']['basemap_id'];
              $style->base_color = $item['style']['base_color'];
              $style->fixed_title = $item['style']['fixed_title'];
              $style->fixed_description = $item['style']['fixed_description'];
              $style->search_box = $item['style']['search_box'];
              $style->share_options = $item['style']['share_options'];
              $style->zoom_controls = $item['style']['zoom_controls'];
              $style->scroll_wheel_zoom = $item['style']['scroll_wheel_zoom'];
              $style->legends = $item['style']['legends'];
              $style->layer_selection = $item['style']['layer_selection'];
              $style->full_screen = $item['style']['full_screen'];

              $style->save();

              $exportitem->style_id = $style->id;
            }
            $export->items()->save($exportitem);
        }

        DB::commit();
        $export->load('items');
        return response()->api($export);
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
