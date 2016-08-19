<?php

namespace App\Http\Controllers;

use App\Adm1;
use App\Adm2;
use App\Adm3;

use Illuminate\Http\Request;

use App\Http\Requests;

class SubnationalsController extends Controller
{
    public function index($adm_level) {
       return response()->api($this->getAdmLevel($adm_level));
    }

    //Lists all HierarchicalAdministrativeSubdivisionCodes of a specific adm level
    public function listHascs($adm_level) {
        $data = [];

        if ($adm_level == 3)
            $hasc = "hasc_2_d";
        else
            $hasc = "hasc_" . $adm_level;

        foreach ($this->getAdmLevel($adm_level) as $key => $subnational)
            if(!is_null($subnational[$hasc]) && $subnational[$hasc] != "<Null>")
                $data[$subnational[$hasc]] = $subnational['name_'.$adm_level];

        return response()->api($data);
    }

    //Function for generating HASC + Discrict Codes into the database
    /*
    function add_hasc_2_d() {
        $data = [];
        $adm3 = $this->getAdmLevel(3);
        foreach ($adm3 as $subnational) {
            $adm2 = Adm2::where('id_2', $subnational->id_2)->first();
            if ($adm2->hasc_2 != "<Null>" && !is_null($adm2->hasc_2)) {
                $subnational->update(['hasc_2_d' => $adm2->hasc_2 . "." . $subnational->cca_3]);
                array_push($data, $adm2->hasc_2 . "." . $subnational->cca_3);
            }
        }

        return $data;
    }
    */
    function getAdmLevel($adm_level) {
        $response = [];
        
        switch($adm_level) {
            case 1:
                $response = Adm1::all();
                break;
            case 2:
                $response = Adm2::all();
                break;
            case 3:
                $response = Adm3::all();
                break;
        }

        return $response;
    }
}
