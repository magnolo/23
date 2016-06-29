<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth, DB;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Export;
use App\Exportitem;
use App\Style;
use App\Logic\Export\ExportRepository;

class ExportController extends Controller
{
    protected $exportRepository;

    public function __construct(ExportRepository $exportRepository){

      $this->exportRepository = $exportRepository;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return response()->api(Export::with(['items', 'image', 'style'])->get());

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
        $export->base_color = $request->get('base_color');
        $export->description = $request->get('description');
        $export->business = $request->get('business');
        $export->usage = $request->get('usage');
        $export->user_id = Auth::user()->id;
        $export->layout_id = 0;

        $export->save();

        $export->load('items');

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
        $export = Export::with(['items', 'image','style'])->where('id', $id)->firstOrFail();
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
        $export->image_id = $request->get('image_id');
        $export->base_color = $request->get('base_color');
        if($request->has('style')){
          $styles = $request->get('style');
          $style = new Style;
          $style->title = "Export: ".$export->title;
          $style->name = str_slug($style->title);

          if(isset($styles['basemap_id'])) $style->basemap_id = $styles['basemap_id'];
          if(isset($styles['base_color'])) $style->base_color = $styles['base_color'];
          if(isset($styles['fixed_title'])) $style->fixed_title = $styles['fixed_title'];
          if(isset($styles['fixed_description']))$style->fixed_description = $styles['fixed_description'];
          if(isset($styles['search_box']))$style->search_box = $styles['search_box'];
          if(isset($styles['share_options']))$style->share_options = $styles['share_options'];
          if(isset($styles['zoom_controls']))$style->zoom_controls = $styles['zoom_controls'];
          if(isset($styles['scroll_wheel_zoom']))$style->scroll_wheel_zoom = $styles['scroll_wheel_zoom'];
          if(isset($styles['legends']))$style->legends = $styles['legends'];
          if(isset($styles['layer_selection']))$style->layer_selection = $styles['layer_selection'];
          if(isset($styles['full_screen']))$style->full_screen = $styles['full_screen'];
          if(isset($styles['image_id']))$style->image_id = $styles['image_id'];

          $style->save();

          $export->style_id = $style->id;
        }

        $export->save();

        foreach($export->items() as $item){
          $item->style()->delete();
          Style::find($item->style_id)->delete();
        }
        $export->items()->delete();
        $this->exportRepository->saveItems($export, $request->get('items'));

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
