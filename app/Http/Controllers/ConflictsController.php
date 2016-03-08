<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Conflictnation;
use App\Conflictevent;

class ConflictsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $conflicts = Conflictevent::with('nations')->get();
        return response()->api($conflicts);
    }

    public function showNations(){
      $nations = Conflictnation::with('conflicts')->get();
        return response()->api($nations);

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
    public function show($iso)
    {
        //
        $nation = Conflictnation::where('iso', $iso)->with('conflicts')->first();
        return response()->api($nation);

    }

    public function conflict($id)
    {
        //
        $conflict = Conflictevent::where('id', $id)->with('nations')->first();
        return response()->api($conflict);
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

    public function importNations(Request $request){
      $nations = $request->input('nations');
      $events = $request->input('events');
      \DB::transaction(function () use ($nations, $events) {
        \DB::table('conflict_events')->truncate();
        \DB::table('conflict_nation_events')->truncate();
        \DB::table('conflict_nations')->truncate();
      foreach($events as $key => $event){
        $ce = new Conflictevent();
        $ce->id = $event['id'];
        $ce->title = $event['conflict'];
        $ce->year = $event['start'];
        $ce->int2014 = $event['int2014'];
        $ce->int2015 = $event['int2015'];
        $ce->territory = $event['territory'];
        $ce->secession = $event['secession'];
        $ce->system = $event['system.ideology'];
        $ce->national_power = $event['national.power'];
        $ce->subnational_predominance = $event['subnational.predominance'];
        $ce->international_power = $event['international.power'];
        $ce->resources = $event['resources'];
        $ce->other = $event['other'];
        $ce->type_id = $event['type_id'];
        $ce->text = $event['text'];
        $ce->save();
      }
      foreach($nations as $key => $nation){
        $cn = new Conflictnation();
        $cn->country = $nation['country'];
        $cn->iso = $nation['iso'];
        $cn->intensity = $nation['intensity'];
        $cn->save();
        foreach($nation['events'] as $k => $event){
            $cn->conflicts()->attach($event);
        }
      }
    });
      return response()->api($request->input());

    }
}
