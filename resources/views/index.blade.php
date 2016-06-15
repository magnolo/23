<!doctype html>
<html ng-app="app">
  <head>
      <base href="/" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui" />
      <link rel="stylesheet" href="{!! asset('css/vendor.css') !!}">
      <link rel="stylesheet" href="{!! asset('css/app.css') !!}">
      <link href='//fonts.googleapis.com/css?family=Roboto:500,400' rel='stylesheet' type='text/css'>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <title update-title>23° | mapping data for global understanding</title>
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-status-bar-style" content="black">
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png">
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png">
      <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
      <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
      <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png">
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">
      <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
      <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
      <link rel="icon" type="image/png" href="/android-chrome-192x192.png" sizes="192x192">
      <meta name="msapplication-square70x70logo" content="/smalltile.png" />
      <meta name="msapplication-square150x150logo" content="/mediumtile.png" />
      <meta name="msapplication-wide310x150logo" content="/widetile.png" />
      <meta name="msapplication-square310x310logo" content="/largetile.png" />

      <!--[if lte IE 10]>
      <script type="text/javascript">document.location.href = '/unsupported-browser'</script>
      <![endif]-->
  </head>
  <body flow-prevent-drop ng-class="{'startup': $root.started, 'loggedIn': $root.isAuthenticated(), 'noHeader': $root.noHeader, 'greyed': $root.greyed, 'loose': $root.looseLayout,  'fixed': $root.fixLayout,'sidebar-closed': !$root.sidebarOpen, 'rowed': $root.rowed, 'addFull': $root.addFull}" layout="column">
      <div id="hack"></div>
      <md-toolbar class="Header md-accent" tabindex="-1" ng-if="!$root.noHeader">
          <header ui-view="header"></header>
      </md-toolbar>
      <md-content layout="row" flex style="overflow:hidden">
        <md-sidenav id="sidemenu" class="md-sidenav-left" md-component-id="leftMenu" ng-if="$root.isAuthenticated()" md-is-locked-open="$mdMedia('gt-sm')" tabindex="-1" md-scroll-y>
            <md-content flex  doAnim-right ui-view="sidemenu"  md-scroll-y layout="column" class="flex" layout-fill layout-align="space-between none"></md-content>
        </md-sidenav>
        <md-sidenav id="sidebar" md-is-open="$root.sidebarOpen" ng-if="$root.sidebar" class="md-sidenav-left md-whiteframe-z1 doAnim-hinge" md-component-id="left" md-is-locked-open="$mdMedia('gt-sm')" tabindex="-1" md-scroll-y>
            <div class="menu-toggler" md-swipe-up="$root.toggleMenu('left')" flex ng-click="$root.toggleMenu('left')" layout="row" layout-align="center center" show-xs></div>
            <md-content flex doAnim-right ui-view="sidebar" md-swipe-down="$root.toggleMenu('left')"  md-scroll-y></md-content>
        </md-sidenav>
        <md-content layout="row" flex role="main" tabindex="-1" md-scroll-y>
            <div ui-view="main" class="Page doAnim-hinge" ng-if="$root.mainView" flex md-scroll-y style="overflow-y:auto"></div>
            <div layout-fill layout="column" flex>
              <div ui-view="additional" class="additional doAnim-hinge" md-scroll-y style="overflow-y:auto" ng-if="$root.additional"></div>
              <div ui-view="map" class="Map_Container" id="map" flex></div>
          </div>
        </md-content>
      </md-content>
      <div class="mobile-window-switcher" hide-gt-sm>
        <md-button class="md-fab md-primary"  ng-click="$root.toggleMenu('left')" aria-label="Show Map/Info">
           <ng-md-icon icon="@{{$root.sidebarOpen ? 'map' : 'expand_less'}}" options='{"duration":300, "rotation":"none"}' size="32" style="top:12px;position:relative"></ng-md-icon>
        </md-button>
      </div>
      <div class="doAnim-hinge" id="items-menu" ng-include="'/views/app/conflictitems/conflictitems.html'" ng-cloak ng-if="$root.featureItems.length > 0 && $root.showItems"></div>
      <div id="main-logo" ui-view="logo" ng-if="$root.logoView" ></div>
      <div id="fullscreen-view" ui-view="fullscreen" class="doAnim-fade-long" layout-fill ng-if="$root.fullscreenView" flex layout="row" layout-align="center center"></div>
      <div class="cssload-container doAnim-fade" ng-if="$root.stateIsLoading">
          <div class="cssload-whirlpool"></div>
          <div class="cssload-text">23°</div>
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
