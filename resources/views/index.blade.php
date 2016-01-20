<!doctype html>
<html ng-app="app">

<head>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="{!! asset('css/vendor.css') !!}">
    <link rel="stylesheet" href="{!! asset('css/app.css') !!}">
    <link href='//fonts.googleapis.com/css?family=Roboto:500,400' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">


    <title>23°</title>
    <!--[if lte IE 10]>
    <script type="text/javascript">document.location.href = '/unsupported-browser'</script>
    <![endif]-->
</head>

<body ng-class="{'greyed': $root.greyed, 'loose': $root.looseLayout, 'sidebar-closed': !$root.sidebarOpen, 'rowed': $root.rowed}" layout="column">
    <md-toolbar class="Header md-accent" tabindex="-1">
        <header ui-view="header"></header>
    </md-toolbar>
    <md-content layout="row" flex>
        <md-sidenav class="Sidebar md-sidenav-left md-whiteframe-z1" md-component-id="left" md-is-locked-open="$root.sidebarOpen" tabindex="-1">
            <!-- Sidebar header/branding -->
            <!--<md-toolbar class="Sidebar-header">
              <h1 class="md-toolbar-tools Sidebar-title">Laravel 5 angular<br>material starter</h1>
            </md-toolbar>-->
            <md-content class="Sidebar-pages md-default-theme doAnim-left" flex ui-view="sidebar" md-scroll-y></md-content>
        </md-sidenav>
        <md-content layout="column" flex role="main" tabindex="-1" md-scroll-y>
            <div ui-view="map" class="Map_Container" id="map" flex></div>
            <div ui-view="main" class="Page doAnim-left" flex md-scroll-y style="overflow-y:auto"></div>
        </md-content>
    </md-content>
    <div class="cssload-container" ng-if="stateIsLoading">
        <div class="cssload-whirlpool"></div>
    </div>


    <script src="{!! asset('js/vendor.js') !!}"></script>
    <script src="{!! asset('js/app.js') !!}"></script>
    <script src="js/pbf.min.js"></script>
    <script src="js/MapBoxVectorTile/dist/Leaflet.MapboxVectorTile.js"></script>

    {{--livereload--}} @if ( Config::get('app.debug') )
    <script type="text/javascript">
        document.write('<script src="' + location.protocol + '//' + ('localhost') + ':35729/livereload.js?snipver=1" type="text/javascript"><\/script>')
    </script>
    @endif
</body>

</html>
