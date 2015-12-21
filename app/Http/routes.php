<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'AngularController@serveApp');
Route::get('/unsupported-browser', 'AngularController@unsupported');
//Route::any('{path?}','AngularController@serveApp')->where("path", ".+");


$api = app('Dingo\Api\Routing\Router');

$api->version('v1', function ($api) {
    /*
     * used for Json Web Token Authentication - https://scotch.io/tutorials/token-based-authentication-for-angularjs-and-laravel-apps
     * Make sure to re-enable CSRF middleware if you're disabling JWT
     */
    $api->controller('authenticate', 'App\Http\Controllers\AuthenticateController');

    $api->get('index', 'App\Http\Controllers\ItemController@index');
    $api->get('index/alphabethical', 'App\Http\Controllers\ItemController@alphabethical');
    $api->get('index/{id}', 'App\Http\Controllers\ItemController@index');
    $api->get('index/{id}/year/latest', 'App\Http\Controllers\ItemController@showLatestYear');
    $api->get('index/{id}/year/{year}', 'App\Http\Controllers\ItemController@showByYear');
    $api->get('index/{id}/structure', 'App\Http\Controllers\ItemController@showWithChildren');
    $api->get('index/{id}/{iso}', 'App\Http\Controllers\ItemController@showByIso');

    $api->get('indicators', 'App\Http\Controllers\IndicatorController@index');

    //$api->get('nations', 'App\Http\Controllers\NationsController@index');
    $api->get('countries', 'App\Http\Controllers\CountriesController@index');
    $api->get('countries/isos', 'App\Http\Controllers\CountriesController@isoList');
    $api->get('countries/{iso}', 'App\Http\Controllers\CountriesController@show');
    $api->get('countries/bbox/{countries}', 'App\Http\Controllers\CountriesController@getBBox');
    $api->post('countries/byIsoNames', 'App\Http\Controllers\CountriesController@getByIsoNames');
    $api->get('countries/byName/{name}', 'App\Http\Controllers\CountriesController@getByName');


    $api->get('data/tables', 'App\Http\Controllers\UserdataController@index');

    $api->get('categories', 'App\Http\Controllers\CategoriesController@index');
    $api->get('categories/{name}', 'App\Http\Controllers\CategoriesController@show');
    $api->get('categories/{name}/indicators', 'App\Http\Controllers\CategoriesController@showWithIndicators');

    $api->get('dataproviders', 'App\Http\Controllers\DataprovidersController@index');

    $api->get('measure_types', 'App\Http\Controllers\MeasureTypesController@index');
});

//protected with JWT
$api->version('v1', ['middleware' => 'api.auth'], function ($api) {


    $api->get('me', 'App\Http\Controllers\UserController@index');
    $api->get('me/data', 'App\Http\Controllers\UserController@myData');

    $api->post('data/tables', 'App\Http\Controllers\UserdataController@createDataTable');
    $api->post('data/tables/{table}/insert', 'App\Http\Controllers\UserdataController@insertDataToTable');

    $api->post('index', 'App\Http\Controllers\IndexController@create');

});
