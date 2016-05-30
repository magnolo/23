<!doctype html>
<html ng-app="app">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <link rel="stylesheet" href="{!! asset('css/vendor.css') !!}">
    <link rel="stylesheet" href="{!! asset('css/app.css') !!}">
    <link href='//fonts.googleapis.com/css?family=Roboto:500,400' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">


    <title>23° | Environmental Perfomance Index</title>
    <!-- Search engines -->
<meta name="description" content="The Environmental Performance Index (EPI) ranks countries' performance on high-priority environmental issues in two areas: protection of human health and protection of ecosystems.">
<!-- Google Plus -->
<!-- Update your html tag to include the itemscope and itemtype attributes. -->
<!-- html itemscope itemtype="http://schema.org/{CONTENT_TYPE}" -->
<meta itemprop="name" content="Environmental Perfomance Index - 23°">
<meta itemprop="description" content="The Environmental Performance Index (EPI) ranks countries' performance on high-priority environmental issues in two areas: protection of human health and protection of ecosystems.">
<meta itemprop="image" content="http://23degree.org/images/background/map-blue.jpg">
<!-- Twitter -->
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@23degree_org">
<meta name="twitter:title" content="Environmental Perfomance Index - 23°">
<meta name="twitter:description" content="The Environmental Performance Index (EPI) ranks countries' performance on high-priority environmental issues in two areas: protection of human health and protection of ecosystems.">
<meta name="twitter:image:src" content="http://23degree.org/images/background/map-blue.jpg">
<meta property="og:url" content="http://epi.23degree.org">
<meta property="og:title" content="Environmental Perfomance Index - 23°">
<meta property="og:description" content="The Environmental Performance Index (EPI) ranks countries' performance on high-priority environmental issues in two areas: protection of human health and protection of ecosystems.">
<meta property="og:site_name" content="23degree">
<meta property="og:image" content="http://23degree.org/images/background/map-blue.jpg">

    <!--[if lte IE 10]>
    <script type="text/javascript">document.location.href = '/unsupported-browser'</script>
    <![endif]-->
</head>
<body ng-class="{'greyed': $root.greyed}">
    <!--<header ui-view="header"></header>-->
    <div ui-view="map" class="Map_Container"></div>
    <div ui-view="sidebar"></div>
    <div ui-view="main" class="Page anim-total" layout-fill></div>
    <div class="cssload-container" ng-if="stateIsLoading">
        <div class="cssload-whirlpool"></div>
    </div>


<script src="{!! asset('js/vendor.js') !!}"></script>
<script src="{!! asset('js/app.js') !!}"></script>
<script src="https://cdn.rawgit.com/devTristan/pbf/master/dist/pbf.min.js"></script>
<script src="js/Leaflet.MapboxVectorTile.js"></script>

{{--livereload--}}
@if ( Config::get('app.debug') )
    <script type="text/javascript">
        document.write('<script src="'+ location.protocol + '//' + ('localhost') +':35729/livereload.js?snipver=1" type="text/javascript"><\/script>')
    </script>
@endif
</body>
</html>
