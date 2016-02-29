<!doctype html>
<html ng-app="app">

<head>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="{!! asset('css/vendor.css') !!}">
    <link rel="stylesheet" href="{!! asset('css/app.css') !!}">
    <link href='//fonts.googleapis.com/css?family=Roboto:500,400' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <title update-title>23°</title>
    <!--[if lte IE 10]>
    <script type="text/javascript">document.location.href = '/unsupported-browser'</script>
    <![endif]-->
</head>

<body ng-class="{'noHeader': $root.noHeader, 'greyed': $root.greyed, 'loose': $root.looseLayout, 'sidebar-closed': !$root.sidebarOpen, 'rowed': $root.rowed}" layout="column">
    <md-toolbar class="Header md-accent slide-toggle" tabindex="-1" ng-if="!$root.noHeader">
        <header ui-view="header"></header>
    </md-toolbar>
    <md-content layout="row" flex md-scroll-y>
        <md-sidenav id="sidebar" class="Sidebar md-sidenav-left md-whiteframe-z1" md-component-id="left" md-is-locked-open="$root.sidebarOpen" tabindex="-1" md-scroll-y>
            <md-content class="Sidebar-pages md-default-theme " flex  doAnim-right ui-view="sidebar"  md-scroll-y></md-content>
        </md-sidenav>
        <md-content layout="column" flex role="main" tabindex="-1" md-scroll-y>
            <div ui-view="map" class="Map_Container" id="map" flex></div>
            <div ui-view="main" class="Page doAnim-hinge"  flex md-scroll-y style="overflow-y:auto"></div>
            <div ui-view="additional" class="additional doAnim-hinge md-whiteframe-z1" md-scroll-y style="overflow-y:auto" ng-if="$root.additional"></div>
        </md-content>
    </md-content>
    <div class="doAnim-hinge" id="items-menu" ng-include="'/views/app/conflictitems/conflictitems.html'" ng-cloak ng-if="$root.featureItems.length > 0 && $root.showItems"></div>
    <div class="cssload-container doAnim-fade" ng-if="$root.stateIsLoading">
        <div class="cssload-whirlpool"></div>
        <div class="cssload-text">23°</div>
    </div>
    <div id="main-logo">
    <a href="http://www.23degree.org" target="_blank"><img src="/images/23logo.svg" width="100" height="80" /><br>
    </a>
  </div>

    <script src="{!! asset('js/vendor.js') !!}"></script>
    <script src="{!! asset('js/app.js') !!}"></script>
    <script src="js/pbf.min.js"></script>
    <script src="js/MapBoxVectorTile/dist/Leaflet.MapboxVectorTile.js"></script>
    <script src="js/papaparse/papaparse.js"></script>
    {{--livereload--}} @if ( Config::get('app.debug') )
    <script type="text/javascript">
        document.write('<script src="' + location.protocol + '//' + ('localhost') + ':35729/livereload.js?snipver=1" type="text/javascript"><\/script>')
    </script>
    @endif
</body>

</html>
