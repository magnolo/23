# 23degree
###### we feel the world

This is most of the code behind 23degree.org which provides a map driven interface and geolocated interactions for data and statistics showing whats going on on our beautiful planet.

There are a lot of different needs for visualizations. The amount of data is huge, so here is a lot of help from all the opensource community in it.

### Basically
the app is based on [Laravel 5] with a [PostGis] database in the back and the frontend is driven by [AngularJS]. There is also [Node.js] on the run for calculating and providing geo specific data through [Mapnik] from the database so everything could be provided in its specific kind for the client.

### more specific
##### the server
is mostly a restful api which provides the requested data for the client. This is made of the following components (list not yet completed):
* [Laravel 5] - The PHP Framework For Web Artisans
  - [JWT-auth] - JSON Web Tokens
  - [Entrust] - Role-based Permissions
  - ...

##### the client
is a javascript driven app built up from [AngularJS] without the use of jQuery. The map, on which all data is uses to project on is [Leaflet]. For the developin process [Node.js] and [Gulp] in combination with Laravels [Elixir] are providing tasks for automations. Watching file changes, refreshing the website, concating files, injecting resources, which are installed through [Bower], using dynamic stylesheet intergration, in this case [Less] and so on.

* [AngularJS]
* [ngStorage]
* [Restangular]
* [UI-Router]
* [Angular Leaflet Directive]
* [SVG Morpheus]
* [Satellizer]
* [Papa Parse]
* [Toastr]
* [Angular Material]
* [Leaflet]
* [D3.js]
* [NVD3]
* ...(not yet completed)

### Version
0.1.0

the whole thing is in the middle of its starting point. so the first pre-alpha is not yet here

### Features

...here to come soon...

### Installation

You need to have [Node.js]  installed which includes the node package manager (npm).
Then you can install Gulp and Bower globally:

```
$ npm install -g gulp bower
```

You also need [Composer] installed. For the dependencies Laravel sticks on.

```sh
$ git clone [git-repo-url] 23
$ cd 23
$ npm install -d
$ bower install
$ composer install
```

Now all the needed packages should be downloaded and installed. Setup the correct configuration files in the .env file, which is located in the root directory of the app. If you cant find it, there is an example file called .env.example there. Here you have to provide the information for connecting to the database.

You also need to run a Postgresql Database Server with PostGis extension to connect to!!!

Watch for the APP_KEY in the .env file. Maybe there is an error with cipher/encrypter showing. If so, provide an string with a lenght of 32

Now you can run:

```sh
$ php artisan migrate
```
and all the needed tables will be set up ind the database for you.

Then if you need some dummy data there you can insert them by typing:
```sh
$ php artisan db:seed
```

If everything went well, then - concratulations - how could this happen... you're awesome.

By typing:

```sh
$ php artisan serve
```
you kick of the backend serve on your machine and can now reach the app in the browser under http://localhost:8000

All your developing tasts will be on watch by typing:
```sh
$ gulp && gulp watch
```

### Todos

 - endless list should follow here....

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does it's job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [git-repo-url]: https://github.com/magnolo/23.git
   [node.js]: <http://nodejs.org>
   [AngularJS]: <http://angularjs.org>
   [Leaflet]: http://leafletjs.com/
   [Composer]: https://getcomposer.org/
   [Laravel 5]: http://laravel.com/
   [Elixir]: http://laravel.com/docs/5.0/elixir
   [Less]: http://lesscss.org/
   [jwt-auth]: https://github.com/tymondesigns/jwt-auth
   [Entrust]: https://github.com/Zizaco/entrust
   [PostGis]: http://postgis.net/
   [D3.js]: http://d3js.org/
   [NVD3]: http://nvd3.org/
   [Toastr]: https://github.com/Foxandxss/angular-toastr
   [Papa Parse]: http://papaparse.com/
   [Satellizer]: https://github.com/sahat/satellizer
   [SVG Morpheus]: https://alexk111.github.io/SVG-Morpheus/
   [Angular Leaflet Directive]:https://github.com/tombatossals/angular-leaflet-directive
   [Angular Material]: https://material.angularjs.org/latest/
   [UI-Router]: https://github.com/angular-ui/ui-router
   [Restangular]: https://github.com/mgonto/restangular
   [ngStorage]: https://github.com/mgonto/restangular
   [Mapnik]: http://mapnik.org/
   [Node.js]: https://nodejs.org/en/
   [Gulp]: <http://gulpjs.com>
   [Bower]: http://bower.io/



=======
