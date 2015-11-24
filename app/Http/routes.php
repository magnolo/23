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

$api = app('Dingo\Api\Routing\Router');

$api->version('v1', function ($api) {
    /*
     * used for Json Web Token Authentication - https://scotch.io/tutorials/token-based-authentication-for-angularjs-and-laravel-apps
     * Make sure to re-enable CSRF middleware if you're disabling JWT
     */
    $api->controller('authenticate', 'App\Http\Controllers\AuthenticateController');


    $api->get('index', 'App\Http\Controllers\IndexController@index');
    $api->get('index/alphabethical', 'App\Http\Controllers\IndexController@alphabethical');
    $api->get('index/{id}', 'App\Http\Controllers\EpiController@index');
    $api->get('index/{id}/year/{year}', 'App\Http\Controllers\IndexController@showByYear');
    $api->get('index/{id}/structure', 'App\Http\Controllers\IndexController@showWithChildren');
    $api->get('index/{id}/{iso}', 'App\Http\Controllers\IndexController@showByIso');

    $api->get('nations', 'App\Http\Controllers\NationsController@index');
    $api->get('countries', 'App\Http\Controllers\NationsController@getCountries');
    $api->get('nations/{iso}', 'App\Http\Controllers\NationsController@show');
    $api->get('nations/bbox/{countries}', 'App\Http\Controllers\NationsController@getBBox');

    $api->get('nations/byName/{name}', 'App\Http\Controllers\NationsController@getByName');
    $api->post('nations/byIsoNames', 'App\Http\Controllers\NationsController@getByIsoNames');

    $api->get('data/tables', 'App\Http\Controllers\UserdataController@index');
});

//protected with JWT
$api->version('v1', ['middleware' => 'api.auth'], function ($api) {


    $api->get('me', 'App\Http\Controllers\UserController@index');

    $api->post('data/tables', 'App\Http\Controllers\UserdataController@createDataTable');
    $api->post('data/tables/{table}/insert', 'App\Http\Controllers\UserdataController@insertDataToTable');

});
