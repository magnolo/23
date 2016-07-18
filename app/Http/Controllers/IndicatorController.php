<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Input;

use App\Indicator;

class IndicatorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //BASIC FILTER
        $limit = Input::get('limit') ? Input::get('limit') : 25;
        $order = Input::get('order') ? Input::get('order') : 'title';
        $page = Input::get('page') ? Input::get('page') : 1;
        $dir = Input::get('dir') ? Input::get('dir') : 'ASC';
        $offset = 0;
        if($page > 1){
          $offset = $limit * ($page - 1);
        }
        $categories = Input::get('categories') ? Input::get('categories') : true;
        $infographic = Input::get('infographic') ? Input::get('infographic') : true;
        $style = Input::get('style') ? Input::get('style') : true;
        $title = Input::get('title') ? Input::get('title') : true;
        $description = Input::get('description') ? Input::get('description') : true;
        $q= Input::get('q') ? Input::get('q') : null;

        $query = Indicator::with('type', 'categories', 'dataprovider', 'style');
        if($q){
          if($categories){
            $query = $query->whereHas('categories', function($query) use ($q){
                $query->where('title', 'like', "%$q%");
            });
          }
          if($style){
            $query = $query->whereHas('style', function($query) use ($q){
                $query->where('title', 'like', "%$q%");
            });
          }
          if($title){
              $query = $query->where('title', 'like', "%$q%");
          }
          if($description){
              $query = $query->where('description', 'like', "%$q%");
          }
          /*if($infographic){
            $query = $query->whereHas('infographics', function($query) use ($q){
                $query->where('title', 'like', $q.'%');
            });
          }*/
        }

        $query = $query->orderBy($order, $dir)->skip($offset)->take($limit);
        return response()->api($query->get());
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
    public function show(Request $request, $id)
    {
        //
        $indicator =  Indicator::where('id',$id)->with('type', 'categories', 'dataprovider', 'userdata')->first();
        $years = \DB::table($indicator->table_name)->select('year')->groupBy('year')->orderBy('year', 'DESC')->get();
        $indicator->years = $years;
        $indicator->max = \DB::table($indicator->table_name)->where('year', $years[0]->year)->max($indicator->column_name);
        $indicator->min = \DB::table($indicator->table_name)->where('year', $years[0]->year)->min($indicator->column_name);
        $indicator->count = \DB::table($indicator->table_name)->where('year', $years[0]->year)->whereNotNull($indicator->column_name)->count($indicator->column_name);

        if($indicator->type->name == "percentage"){
          if($indicator->min > 0 && $indicator->max < 100){
            $indicator->max = 100;
            $indicator->min = 0;
          }
        }

        if($indicator->userdata->gender != ""){
          $gender = \DB::table($indicator->table_name)->select($indicator->userdata->gender.' as gender')->groupBy('gender')->orderBy('gender', 'DESC')->get();
          $indicator->gender = $gender;
        }
        $indicator->styled = $indicator->getStyle();

        if($request->has('data')){
          if($request->get('data')){
            $iso_field = $indicator->userdata->iso_type == 'iso-3166-1' ? 'adm0_a3': 'iso_a2';
            $data = \DB::table($indicator->table_name)
              ->where('year', \DB::raw('(select MAX(tt_'.$indicator->table_name.'.year) from tt_'.$indicator->table_name.')'))
              ->leftJoin('countries', $indicator->table_name.".".$indicator->iso_name, '=', 'countries.'.$iso_field)
              ->select($indicator->table_name.".".$indicator->column_name.' as score', $indicator->table_name.'.year','countries.'.$iso_field.' as iso','countries.admin as country')
              ->orderBy($indicator->table_name.".".$indicator->column_name, 'desc')->get();
            $response = [];
            $rank = 1;
            foreach($data as $item){
              if(!is_null($item->score)){
                $item->score = floatval($item->score);
                $item->{$indicator->column_name} = $item->score;
                $item->rank = $rank;
                $response[] = $item;

                $rank++;
              }
            }
            $indicator->data = $response;
          }
        }

        return response()->api($indicator);
    }

    public function history($id, $iso){
        $indicator =  Indicator::where('id',$id)->with('type', 'categories', 'dataprovider', 'userdata')->first();
        $data = \DB::table($indicator->table_name)->select(['year',$indicator->column_name.' as score'])->where('iso', strtoupper($iso));
        if(Input::has('gender')){
          if(Input::get('gender') != 'all'){
            $data = $data->where($indicator->userdata->gender, Input::get('gender'));
          }
        }
        $data = $data->orderBy('year', 'DESC')->get();
        $response = [];
        foreach($data as $item){
          if(!is_null($item->score)){
            $item->score = floatval($item->score);
            $item->{$indicator->column_name} = $item->score;
            $response[] = $item;
          }
        }

        return response()->api($response);
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
        $cats = array();
        foreach($request->input('categories') as $cat){
          $cats[] = $cat['id'];
        };
        $indicator = Indicator::find($id);
        $indicator->title = $request->input('title');
        $indicator->name = str_slug($request->input('title'));
        $indicator->description = str_slug($request->input('description'));
        $indicator->style_id = $request->input('style_id');
        $indicator->measure_type_id = $request->input('type')['id'];
        $indicator->dataprovider_id = $request->input('dataprovider')['id'];
        $indicator->is_official = $request->input('is_official');
        $indicator->is_public = $request->input('is_public');
        $indicator->categories()->sync($cats);

        return response()->api($indicator->save());
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
        $data = array();
        //$user = Auth::user();
        $indicator = Indicator::where('id',$id)->with('categories', 'dataprovider', 'userdata')->first();
        //  return response()->api($indicator);
        \DB::transaction(function () use ($indicator, &$data) {
          $data['colum'] = \Schema::table($indicator->userdata->table_name, function($table) use ($indicator){
            $table->dropColumn($indicator->column_name);
          });
          $data['indicator'] = $indicator->delete();
        });
        return response()->api($data);
    }

    public function fetchData($id){
      $indicator =  Indicator::where('id',$id)->with('type', 'categories', 'dataprovider', 'userdata')->first();
      $iso_field = $indicator->userdata->iso_type == 'iso-3166-1' ? 'adm0_a3': 'iso_a2';
      $data = \DB::table($indicator->table_name)
        ->where('year', \DB::raw('(select MAX(tt_'.$indicator->table_name.'.year) from tt_'.$indicator->table_name.')'))
        ->leftJoin('countries', $indicator->table_name.".".$indicator->iso_name, '=', 'countries.'.$iso_field)
        ->select($indicator->table_name.".".$indicator->column_name.' as score', $indicator->table_name.'.year','countries.'.$iso_field.' as iso','countries.admin as country')
        ->orderBy($indicator->table_name.".".$indicator->column_name, 'desc')->get();
      $response = [];
      $rank = 1;
      foreach($data as $item){
        if(!is_null($item->score)){
          $item->score = floatval($item->score);
          $item->{$indicator->column_name} = $item->score;
          $item->rank = $rank;
          $response[] = $item;

          $rank++;
        }
      }

      return response()->api($response);
    }

    public function fetchDataByIso($id, $iso){
      $indicator =  Indicator::where('id',$id)->with('type', 'categories', 'dataprovider', 'userdata')->first();
      $iso_field = $indicator->userdata->iso_type == 'iso-3166-1' ? 'adm0_a3': 'iso_a2';
      $data = \DB::table($indicator->table_name)
        ->where($indicator->iso_name, $iso)
        ->whereNotNull($indicator->table_name.".".$indicator->column_name)
        ->leftJoin('countries', $indicator->table_name.".".$indicator->iso_name, '=', 'countries.'.$iso_field)
        ->select($indicator->table_name.".".$indicator->column_name.' as score', $indicator->table_name.'.year')
        ->orderBy($indicator->table_name.".".$indicator->column_name, 'desc')->get();
      return response()->api($data);
    }

    public function fetchDataByYear($id, $year){
      $indicator = Indicator::find($id);
      $iso_field = $indicator->userdata->iso_type == 'iso-3166-1' ? 'adm0_a3': 'iso_a2';
      $data = \DB::table($indicator->table_name)
        ->where('year', $year)
        ->whereNotNull($indicator->table_name.".".$indicator->column_name)
        ->leftJoin('countries', $indicator->table_name.".".$indicator->iso_name, '=', 'countries.'.$iso_field)
        ->select($indicator->table_name.".".$indicator->column_name.' as score', $indicator->table_name.'.year','countries.'.$iso_field.' as iso','countries.admin as country')
        ->orderBy($indicator->table_name.".".$indicator->column_name, 'desc')->get();

      return response()->api($data);
    }
    public function fetchDataByGender($id, $gender){
      $indicator = Indicator::find($id);
      $iso_field = $indicator->userdata->iso_type == 'iso-3166-1' ? 'adm0_a3': 'iso_a2';
      $data = \DB::table($indicator->table_name)
        ->where($indicator->userdata->gender, $gender)
        ->whereNotNull($indicator->table_name.".".$indicator->column_name)
        ->leftJoin('countries', $indicator->table_name.".".$indicator->iso_name, '=', 'countries.'.$iso_field)
        ->select($indicator->table_name.".".$indicator->column_name.' as score', $indicator->table_name.'.year','countries.'.$iso_field.' as iso','countries.admin as country')
        ->orderBy($indicator->table_name.".".$indicator->column_name, 'desc')->get();
      return response()->api($data);
    }
    public function fetchDataByYearAndGender($id,$year,  $gender){
      $indicator = Indicator::find($id);
      $iso_field = $indicator->userdata->iso_type == 'iso-3166-1' ? 'adm0_a3': 'iso_a2';
      $data = \DB::table($indicator->table_name)
        ->where([$indicator->userdata->gender => $gender , 'year' => $year])
        ->whereNotNull($indicator->table_name.".".$indicator->column_name)
        ->leftJoin('countries', $indicator->table_name.".".$indicator->iso_name, '=', 'countries.'.$iso_field)
        ->select($indicator->table_name.".".$indicator->column_name.' as score', $indicator->table_name.'.year','countries.'.$iso_field.' as iso','countries.admin as country')
        ->orderBy($indicator->table_name.".".$indicator->column_name, 'desc')->get();
      return response()->api($data);
    }
}
