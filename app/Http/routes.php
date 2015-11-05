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

Route::group(['prefix' => 'api/1/'], function () {

    /*
     * used for Json Web Token Authentication - https://scotch.io/tutorials/token-based-authentication-for-angularjs-and-laravel-apps
     * Make sure to re-enable CSRF middleware if you're disabling JWT
     * */
    Route::controller('authenticate', 'AuthenticateController');

    Route::get('index', 'IndexController@index');
    Route::get('index/alphabethical', 'IndexController@alphabethical');
    Route::get('index/{id}', 'EpiController@index');
    Route::get('index/{id}/year/{year}', 'IndexController@showByYear');
    Route::get('index/{id}/structure', 'IndexController@showWithChildren');

    Route::get('data', 'UserdataController@index');
    Route::get('data/{id}', 'UserdataController@show');


    Route::get('nations', 'NationsController@index');
    Route::get('nations/bbox/{countries}', 'NationsController@getBBox');
    Route::get('nations/{iso}', 'NationsController@show');
    Route::get('nations/{iso}/index/{index}', 'NationsController@showIndex');

    Route::get('me', 'UserController@index');

});
