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
        $export->image_id = $request->get('image_id');
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
