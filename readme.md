<<<<<<< HEAD
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

You to have installed [Node.js] which includes the node package manager (npm).
Then you can install Gulp and Bower globally:

```
$ npm i -g gulp bower
```

You also need [Composer] installed. For the dependencies Laravel sticks on.

```sh
$ git clone [git-repo-url] 23
$ cd 23
$ npm i -d
$ bower install
$ composer install
```

Now all the needed packages should be download and installed. Setup the correct configuration files in the .env file, which is located in the root directory of the app. If you cant find it, there is an example file called .env.example there. Here you have to provide the information for connecting to the database.

You also need to run a Postgresql Database Server with PostGis extension to connect to!!!

Now you can run:

```sh
$ php artisan migration 
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
## Laravel 5.1 Angular Material Starter
> Version 2.10

[![Latest Stable Version](https://poser.pugx.org/jadjoubran/laravel5-angular-material-starter/v/stable)](https://packagist.org/packages/jadjoubran/laravel5-angular-material-starter)
[![Build Status](https://travis-ci.org/jadjoubran/laravel5-angular-material-starter.svg?branch=master)](https://travis-ci.org/jadjoubran/laravel5-angular-material-starter)
[![StyleCI](https://styleci.io/repos/34944760/shield)](https://styleci.io/repos/34944760)
[![Code Climate](https://codeclimate.com/github/jadjoubran/laravel5-angular-material-starter/badges/gpa.svg)](https://codeclimate.com/github/jadjoubran/laravel5-angular-material-starter)
[![License](https://poser.pugx.org/jadjoubran/laravel5-angular-material-starter/license)](https://packagist.org/packages/jadjoubran/laravel5-angular-material-starter)

<a href="https://infinite-dusk-3948.herokuapp.com/" target="_blank">View DEMO</a>

![Laravel & Angular](https://i.imgur.com/ZbLzOPP.jpg)


##### Table of Contents
[Overview](#overview)  
[Installation](#installation)  
[Issues, questions and feature requests](#issues)  
[Planned features](#planned_features)  
[Do It Yourself](#DIY)  
[Contributing](#contributing)

<a name="overview"></a>
## OVERVIEW
This is a starter project that gives you an out of the box configuration Laravel 5.1 and AngularJS (folder by feature architecture).
Here are the goodies that you'll get:

* Laravel 5.1
* Angular
* Angular Material
* Blazing fast Elixir 3.0 configuration with custom tasks
* artisan generators for angular (artisan ng:feature name, artisan ng:dialog name, etc..)
* check out the full <a href="http://laravel-ng-material.elasticbeanstalk.com/#/" target="_blank">list of features</a>


<a name="installation"></a>
## Installation


Heads up for Windows + Vagrant users: Start by applying the fix in [issue #61](https://github.com/jadjoubran/laravel5-angular-material-starter/issues/61#issuecomment-145564131)

    composer create-project jadjoubran/laravel5-angular-material-starter --prefer-dist
    cd laravel5-angular-material-starter
    #fix database credentials in .env
    npm install -g gulp bower
    npm install
    bower install
    gulp && gulp watch
    php artisan serve
* You're ready to go! <a href="http://localhost:8000" target="_blank">http://localhost:8000</a>
* Star the repo and submit your feedback as a new issue or to <a href="https://twitter.com/joubranjad" target="_blank">@JoubranJad</a>

<a name="issues"></a>
## Issues, questions and feature requests
Open a new issue, I'd love to help.


<a name="planned_features"></a>
## Planned features

Moved to [github issues](https://github.com/jadjoubran/laravel5-angular-material-starter/issues/). 

<a name="DIY"></a>
## Do It Yourself

A nice article on <a href="http://www.sitepoint.com/flexible-and-easily-maintainable-laravel-angular-material-apps/" target="_blank">sitepoint</a> that explains the first few versions of this repository. Recommended read if you're not familiar with the underlying technologies.

<a name="contributing"></a>
## Contributing

Thank you for contributing to this repository.

Here are the guidelines:

```bash
#setup jshint
npm install -g jshint
```

1. run `jshint angular/**/*.js` to make sure that your javascript code is linted.
2. run `gulp --production` at the end if you changed any HTML, Less or JS. Do not send Pull Requests without running this command (unless you haven't touched the frontend)
3. delete `.map` files `rm public/css/app.css.map public/css/vendor.css.map public/js/app.map public/js/vendor.js.map`
4. If you are adding/modifying backend functionality, make sure to include the apprioriate `test`. Let me know if you need help writing the test
    
>>>>>>> importer
