(function(){
	"use strict";

	var app = angular.module('app',
		[
		'app.controllers',
		'app.filters',
		'app.services',
		'app.directives',
		'app.routes',
		'app.config',
		]);


	angular.module('app.routes', ['ui.router', 'ngStorage', 'satellizer']);
	angular.module('app.controllers', ['ui.router', 'ngMaterial', 'ngStorage', 'restangular', 'ngMdIcons', 'angular-loading-bar', 'ngMessages', "leaflet-directive",'chart.js']);
	angular.module('app.filters', []);
	angular.module('app.services', ['ui.router', 'ngStorage', 'restangular']);
	angular.module('app.directives', []);
	angular.module('app.config', []);

})();

(function(){
	"use strict";

	angular.module('app.routes').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){

		var getView = function(viewName){
			return '/views/app/' + viewName + '/' + viewName + '.html';
		};

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('app', {
				abstract: true,
				views: {
				/*	sidebar: {
						templateUrl: getView('sidebar')
					},*/
					header: {
						templateUrl: getView('header')
					},
					main: {}
				}
			})

			.state('app.landing', {
				url: '/',
				data: {pageName: 'Overview'},
				views: {
					'main@': {
						templateUrl: getView('landing')
					}
				}
			})
			.state('app.epi', {
				url: '/epi',
				data: {pageName: 'Environment Performance Index'},
				views: {
					'main@': {
						templateUrl: getView('epi')
					},
					'map@':{
						templateUrl: getView('map')
					}
				}
			})
			.state('app.install', {
				url: '/install',
				data: {pageName: 'Install'},
				views: {
					'main@': {
						templateUrl: getView('install')
					}
				}
			})
			.state('app.tabs', {
				url: '/features',
				data: {pageName: 'Features'},
				views: {
					'main@': {
						templateUrl: getView('tabs')
					}
				}
			})
			.state('app.deploy', {
				url: '/deploy',
				data: {pageName: 'Deploy'},
				views: {
					'main@': {
						templateUrl: getView('deploy')
					}
				}
			})
			.state('app.theme', {
				url: '/theme',
				data: {pageName: 'Theme'},
				views: {
					'main@': {
						templateUrl: getView('theme')
					}
				}
			})
			.state('app.toasts', {
				url: '/toasts',
				data: {pageName: 'Toasts'},
				views: {
					'main@': {
						templateUrl: getView('toasts')
					}
				}
			})
			.state('app.dialogs', {
				url: '/dialogs',
				data: {pageName: 'Dialogs'},
				views: {
					'main@': {
						templateUrl: getView('dialogs')
					}
				}
			})
			.state('app.generators', {
				url: '/generators',
				data: {pageName: 'Artisan generators'},
				views: {
					'main@': {
						templateUrl: getView('generators')
					}
				}
			})
			.state('app.jwt_auth', {
				url: '/jwt_auth',
				data: {pageName: 'JSON Web Token Authentication'},
				views: {
					'main@': {
						templateUrl: getView('jwt_auth')
					}
				}
			})
			.state('app.elixir', {
				url: '/elixir',
				data: {pageName: 'Elixir'},
				views: {
					'main@': {
						templateUrl: getView('elixir')
					}
				}
			})
			.state('app.rest_api', {
				url: '/rest_api',
				data: {pageName: 'REST API'},
				views: {
					'main@': {
						templateUrl: getView('rest_api')
					}
				}
			})
			.state('app.unsupported_browser', {
				url: '/unsupported_browser',
				data: {pageName: 'Unsupported Browser'},
				views: {
					'main@': {
						templateUrl: getView('unsupported_browser')
					}
				}
			})
			.state('app.misc', {
				url: '/misc',
				data: {pageName: 'Miscellaneous features'},
				views: {
					'main@': {
						templateUrl: getView('misc')
					}
				}
			});



	}]);
})();

(function(){
	"use strict";

	angular.module('app.routes').run(["$rootScope", function($rootScope){
		$rootScope.$on("$stateChangeStart", function(event, toState){

			if (toState.data && toState.data.pageName){
				$rootScope.current_page = toState.data.pageName;
			}


		});
		$rootScope.$on("$viewContentLoaded", function(event, toState){
			window.Prism.highlightAll();
		});
	}]);

})();

(function (){
    "use strict";

    angular.module('app.config').config(["$authProvider", function ($authProvider){
        // Satellizer configuration that specifies which API
        // route the JWT should be retrieved from
        $authProvider.loginUrl = '/api/1/authenticate/auth';
    }]);

})();

(function () {
	"use strict";

	angular.module('app.config').config(["ChartJsProvider", function (ChartJsProvider) {
		//
		ChartJsProvider.setOptions({
			colours: ['#FF5252', '#FF8A80'],
			responsive: true
		});
		// Configure all line charts
		ChartJsProvider.setOptions('Line', {
			datasetFill: false
		});
	}]);

})();

(function (){
	"use strict";

	angular.module('app.config').config(["cfpLoadingBarProvider", function (cfpLoadingBarProvider){
		cfpLoadingBarProvider.includeSpinner = false;
	}]);

})();

(function(){
	"use strict";

	angular.module('app.config').config( ["RestangularProvider", function(RestangularProvider) {
		RestangularProvider
		.setBaseUrl('/api/1/');
	}]);

})();

(function(){
	"use strict";

	angular.module('app.config').config(["$mdThemingProvider", function($mdThemingProvider) {
		/* For more info, visit https://material.angularjs.org/#/Theming/01_introduction */
		$mdThemingProvider.theme('default')
		.primaryPalette('indigo')
		.accentPalette('grey')
		.warnPalette('red');
	}]);

})();

(function(){
	"use strict";

	angular.module('app.filters').filter( 'capitalize', function(){
		return function(input, all) {
			return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g,function(txt){
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			}) : '';
		};
	});
})();

(function(){
	"use strict";

	angular.module('app.filters').filter( 'humanReadable', function(){
		return function humanize(str) {
			if ( !str ){
				return '';
			}
			var frags = str.split('_');
			for (var i=0; i<frags.length; i++) {
				frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
			}
			return frags.join(' ');
		};
	});
})();
(function(){
	"use strict";

	angular.module('app.filters').filter( 'trustHtml', ["$sce", function( $sce ){
		return function( html ){
			return $sce.trustAsHtml(html);
		};
	}]);
})();
(function(){
	"use strict";

	angular.module('app.filters').filter('ucfirst', function() {
		return function( input ) {
			if ( !input ){
				return null;
			}
			return input.substring(0, 1).toUpperCase() + input.substring(1);
		};
	});

})();

(function(){
    "use strict";

    angular.module('app.services').factory('MapService', ["leafletData", function(leafletData){
        //
        var leaflet = {};
        return {
          setLeafletData: function(leaf){
            leaflet = leaflet;
          },
          getLeafletData: function(){
            return leaflet;
          }
        }
    }]);

})();

(function(){
	"use strict";

	angular.module("app.services").factory('DialogService', ["$mdDialog", function($mdDialog){

		return {
			fromTemplate: function(template, $scope){

				var options = {
					templateUrl: '/views/dialogs/' + template + '/' + template + '.html'
				};

				if ($scope){
					options.scope = $scope.$new();
				}

				return $mdDialog.show(options);
			},

			hide: function(){
				return $mdDialog.hide();
			},

			alert: function(title, content){
				$mdDialog.show(
					$mdDialog.alert()
						.title(title)
						.content(content)
						.ok('Ok')
				);
			}
		};
	}]);
})();
(function(){
	"use strict";

	angular.module("app.services").factory('ToastService', ["$mdToast", function($mdToast){

		var delay = 6000,
			position = 'top right',
			action = 'OK';

		return {
			show: function(content){
				if (!content){
					return false;
				}

				return $mdToast.show(
					$mdToast.simple()
						.content(content)
						.position(position)
						.action(action)
						.hideDelay(delay)
				);
			},
			error: function(content){
				if (!content){
					return false;
				}

				return $mdToast.show(
					$mdToast.simple()
						.content(content)
						.position(position)
						.theme('warn')
						.action(action)
						.hideDelay(delay)
				);
			}
		};
	}]);
})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('DialogsCtrl', ["$scope", "DialogService", function($scope, DialogService){
		$scope.alertDialog = function(){
			DialogService.alert('This is an alert title', 'You can specify some description text in here.');
		};

		$scope.customDialog = function(){
			DialogService.fromTemplate('add_users', $scope);
		};
	}]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('ElixirCtrl', function(){
        //
    });

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('EpiCtrl', ["$scope", "$rootScope", "Restangular", "leafletData", "MapService", function ($scope, $rootScope, Restangular, leafletData, MapService) {
		$scope.current = "";
		$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
		$scope.series = ['Series A', 'Series B'];
		$scope.data = [
			[65, 59, 80, 81, 56, 55, 40],
			[28, 48, 40, 19, 86, 27, 90]
		];
		var epi = Restangular.all('epi');
		epi.getList().then(function (data) {
			$scope.epi = data;
			$scope.drawCountries();
		});
		$scope.setCurrent = function (nat) {
			$scope.current = nat;
		};
		$scope.getOffset = function () {
			if (!$scope.current) {
				return 0;
			}
			return $scope.current.rank - 2 || 0;
		};
		$scope.getTendency = function () {
			if (!$scope.current) {
				return 'arrow_drop_down'
			}
			return $scope.current.percent_change > 0 ? 'arrow_drop_up' : 'arrow_drop_down';
		};
		var getNationByName = function (name) {
			var nation = {};
			angular.forEach($scope.epi, function (nat) {
				if (nat.country == name) {
					nation = nat;
				}
			});
			return nation;
		};

		var createCanvas = function (colors) {
			$scope.canvas = document.createElement('canvas');
			$scope.canvas.width = 256;
			$scope.canvas.height = 10;
			$scope.ctx = $scope.canvas.getContext('2d');
			var gradient = $scope.ctx.createLinearGradient(0, 0, 256, 10);
			gradient.addColorStop(0, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.53, 'rgba(128, 243, 198,1)');
			gradient.addColorStop(1, 'rgba(102,102,102,1)');
			$scope.ctx.fillStyle = gradient;
			$scope.ctx.fillRect(0, 0, 256, 10);
			$scope.palette = $scope.ctx.getImageData(0, 0, 256, 1).data;
			document.getElementsByTagName('body')[0].appendChild($scope.canvas);
		}
		createCanvas();
		$scope.drawCountries = function () {

			console.log(MapService.getLeafletData());
			leafletData.getMap('map').then(function (map) {
				//	L.tileLayer('http://localhost:3001/services/postgis/countries_big/geom/dynamicMap/{z}/{x}/{y}.png').addTo(map);
				var debug = {};

				var apiKey = 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ';
				var url = 'http://localhost:3001/services/postgis/countries_big/geom/vector-tiles/{z}/{x}/{y}.pbf?fields=id,admin,adm0_a3,name,name_long'; //
				var url2 = 'https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6-dev/{z}/{x}/{y}.vector.pbf?access_token=' + apiKey;
				var mvtSource = new L.TileLayer.MVTSource({
					url: url, //"http://spatialserver.spatialdev.com/services/vector-tiles/gaul_fsp_india/{z}/{x}/{y}.pbf",
					debug: false,
					clickableLayers: ['countries_big_geom'],
					mutexToggle: true,
					onClick: function (evt, t) {
						//map.fitBounds(evt.target.getBounds());
						if($scope.current.country != evt.feature.properties.admin){
							map.panTo(evt.latlng);
							map.panBy(new L.Point(-200,0));
						}
						$scope.current = getNationByName(evt.feature.properties.admin);
					},
					getIDForLayerFeature: function (feature) {

						return feature.properties.id;
					},

					/**
					 * The filter function gets called when iterating though each vector tile feature (vtf). You have access
					 * to every property associated with a given feature (the feature, and the layer). You can also filter
					 * based of the context (each tile that the feature is drawn onto).
					 *
					 * Returning false skips over the feature and it is not drawn.
					 *
					 * @param feature
					 * @returns {boolean}
					 */
					filter: function (feature, context) {

						if (feature.layer.name === 'admin' || feature.layer.name === 'gaul_2014_adm1_label') {
							//console.log(feature);
							if (feature.properties.admin_level == 0 || feature.properties.admin_level == 1 || feature.properties.admin_level == 2) {
								return true;
							} else {
								return false;
							}

						}
						return true;
					},

					style: function (feature) {
						var style = {};
						var nation = getNationByName(feature.properties.admin);
						var type = feature.type;
						switch (type) {
						case 1: //'Point'
							style.color = 'rgba(49,79,79,0.01)';
							style.radius = 5;
							style.selected = {
								color: 'rgba(255,255,0,0.5)',
								radius: 0
							};
							break;
						case 2: //'LineString'
							style.color = 'rgba(255,0,0,1)';
							style.size = 1;
							style.selected = {
								color: 'rgba(255,25,0,1)',
								size: 2
							};
							break;
						case 3: //'Polygon'
							if (nation.score) {
								var colorPos = parseInt(256 / 100 * nation.score) * 4;
								var color = 'rgba(' + $scope.palette[colorPos] + ', ' + $scope.palette[colorPos + 1] + ', ' + $scope.palette[colorPos + 2] + ',' + $scope.palette[colorPos +3] + ')';
								style.color = color;
								style.outline = {
									color: 'rgba(50,50,50,0.4)',
									size: 1
								};
								style.selected = {
									color: 'rgba(255,255,255,0.0)',
									outline: {
										color: 'rgba(0,0,0,0.5)',
										size: 1
									}
								};
								break;
							}
							else{
								style.color = 'rgba(255,255,255,0)';
								style.outline = {
									color: 'rgba(255,255,255,0)',
									size: 1
								};
							}
						}

						//	if (feature.layer.name === 'gaul_2014_adm1_label') {
						style.ajaxSource = function (mvtFeature) {
							var id = mvtFeature.id;
							//	console.log(id);
							//return 'http://spatialserver.spatialdev.com/fsp/2014/fsp/aggregations-no-name/' + id + '.json';
						};

						style.staticLabel = function (mvtFeature, ajaxData) {
							var style = {
								html: ajaxData.total_count,
								iconSize: [33, 33],
								cssClass: 'label-icon-number',
								cssSelectedClass: 'label-icon-number-selected'
							};
							return style;
						};
						//	}

						return style;
					},

					/**
					 * When we want to link events between layers, like clicking on a label and a
					 * corresponding polygon freature, this will return the corresponding mapping
					 * between layers. This provides knowledge of which other feature a given feature
					 * is linked to.
					 *
					 * @param layerName  the layer we want to know the linked layer from
					 * @returns {string} returns corresponding linked layer
					 */
					layerLink: function (layerName) {
						if (layerName.indexOf('_label') > -1) {
							return layerName.replace('_label', '');
						}
						return layerName + '_label';
					}

				});
				debug.mvtSource = mvtSource;
				map.addLayer(mvtSource);
			});
		};
	}]);
})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('GeneratorsCtrl', function(){
        //
    });

})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('HeaderCtrl', ["$scope", "$rootScope", function($scope, $rootScope){

		$scope.$watch(function(){
			return $rootScope.current_page;
		}, function(newPage){
			$scope.current_page = newPage || 'Page Name';
		});


	}]);

})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('JwtAuthCtrl', ["$scope", "$auth", "Restangular", function($scope, $auth, Restangular){

		var credentials = {};

		$scope.requestToken = function(){
			// Use Satellizer's $auth service to login because it'll automatically save the JWT in localStorage
			$auth.login(credentials).then(function (data){
				// If login is successful, redirect to the users state
				//$state.go('dashboard');
			});
		};

		// This request will hit the getData method in the AuthenticateController
		// on the Laravel side and will return your data that require authentication
		$scope.getData = function(){
			Restangular.all('authenticate/data').get().then(function (response){

			}, function (error){});
		};



	}]);

})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('LandingCtrl', ["$scope", "$mdToast", "$mdDialog", "$interval", "ToastService", "DialogService", function($scope, $mdToast, $mdDialog, $interval, ToastService, DialogService){

		$scope.promoImage = 'https://i.imgur.com/ZbLzOPP.jpg';
		$scope.icon = 'send';

		var icons = [
				'office', 'facebook', 'twitter', 'apple', 'whatsapp', 'linkedin', 'windows', 'accessibility', 'alarm', 'aspect_ratio',
				'autorenew', 'bookmark_outline', 'dashboard', 'dns', 'favorite_outline', 'get_app', 'highlight_remove', 'history', 'list',
				'picture_in_picture', 'print', 'settings_ethernet', 'settings_power', 'shopping_cart', 'spellcheck', 'swap_horiz', 'swap_vert',
				'thumb_up', 'thumbs_up_down', 'translate', 'trending_up', 'visibility', 'warning', 'mic', 'play_circle_outline', 'repeat',
				'skip_next', 'call', 'chat', 'clear_all', 'dialpad', 'dnd_on', 'forum', 'location_on', 'vpn_key', 'filter_list', 'inbox',
				'link', 'remove_circle_outline', 'save', 'text_format', 'access_time', 'airplanemode_on', 'bluetooth', 'data_usage',
				'gps_fixed', 'now_wallpaper', 'now_widgets', 'storage', 'wifi_tethering', 'attach_file', 'format_line_spacing',
				'format_list_numbered', 'format_quote', 'vertical_align_center', 'wrap_text', 'cloud_queue', 'file_download', 'folder_open',
				'cast', 'headset', 'keyboard_backspace', 'mouse', 'speaker', 'watch', 'audiotrack', 'edit', 'brush', 'looks', 'crop_free',
				'camera', 'filter_vintage', 'hdr_strong', 'photo_camera', 'slideshow', 'timer', 'directions_bike', 'hotel', 'local_library',
				'directions_walk', 'local_cafe', 'local_pizza', 'local_florist', 'my_location', 'navigation', 'pin_drop', 'arrow_back', 'menu',
				'close', 'more_horiz', 'more_vert', 'refresh', 'phone_paused', 'vibration', 'cake', 'group', 'mood', 'person',
				'notifications_none', 'plus_one', 'school', 'share', 'star_outline'
			],
			counter = 0;

		$interval(function(){
			$scope.icon = icons[++counter];
			if (counter > 112){
				counter = 0;
			}
		}, 2000);

	}]);

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('MapCtrl', ["$scope", "$rootScope", "$timeout", "MapService", "leafletData", "$http", function ($scope, $rootScope, $timeout, MapService, leafletData, $http) {
		//
		var apiKey = 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ';

		/*$scope.defaults = {
			tileLayer: 'https://{s}.tiles.mapbox.com/v4/mapbox.pencil/{z}/{x}/{y}.png?access_token=' + apiKey,
			maxZoom: 14,
			detectRetina: true,
			attribution: ''
		};
		$scope.center = {
			lat: 0,
			lng: 0,
			zoom: 3
		};*/
		angular.extend($scope, {
			center: {
				lat: 0,
				lng: 0,
				zoom: 3
			},
			layers: {
				baselayers: {
					xyz: {
						name: 'MapBox Pencil',
						url: 'https://{s}.tiles.mapbox.com/v4/mapbox.pencil/{z}/{x}/{y}.png?access_token=' + apiKey,
						type: 'xyz'
					}
				},
				overlays: {
					demosutfgrid: {
						name: 'UTFGrid Interactivity',
						type: 'utfGrid',
						url: 'http://{s}.tiles.mapbox.com/v3/mapbox.geography-class/{z}/{x}/{y}.grid.json?callback={cb}',
						visible: true
					}
				}
			}
		});
		$scope.searchIP = function (ip) {
			var url = "http://freegeoip.net/json/" + ip;
			$http.get(url).success(function (res) {
				$scope.center = {
					lat: res.latitude,
					lng: res.longitude,
					zoom: 3
				}
				$scope.ip = res.ip;
			})
		};

		$scope.searchIP("");
		$scope.interactivity = "";
		$scope.flag = "";
		$scope.$on('leafletDirectiveMap.utfgridMouseover', function (event, leafletEvent) {
			// the UTFGrid information is on leafletEvent.data
			$scope.interactivity = leafletEvent.data.admin;
			$scope.flag = "data:image/png;base64," + leafletEvent.data.flag_png;

		});
		$scope.$on('leafletDirectiveMap.utfgridMouseout', function (event, leafletEvent) {
			$scope.interactivity = "";
			$scope.flag = "";
		});
		MapService.setLeafletData(leafletData.getMap('map'));

	}]);
})();

(function (){
    "use strict";

    angular.module('app.controllers').controller('LoginCtrl', function (){

    });

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('MiscCtrl', function(){
        //
    });

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('RestApiCtrl', function(){
        //
    });

})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('SidebarCtrl', ["$scope", "$state", function($scope, $state){


	}]);

})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('DashboardCtrl', function(){

	});

})();
(function(){
	"use strict";

	angular.module('app.controllers').controller('ToastsCtrl', ["$scope", "ToastService", function($scope, ToastService){

		$scope.toastSuccess = function(){
			ToastService.show('User added successfully!');
		};

		$scope.toastError = function(){
			ToastService.error('Connection interrupted!');
		};

	}]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('UnsupportedBrowserCtrl', function(){
        //
    });

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('AddUsersCtrl', ["$scope", "DialogService", function($scope, DialogService){

        $scope.save = function(){
	        //do something useful
            DialogService.hide();
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

    }]);

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'DataListingCtrl', function(){
		//
    });

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'dataListing', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/data_listing/data_listing.html',
			controller: 'DataListingCtrl',
			link: function( $scope, element, $attrs ){
				//
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'BubblesCtrl', function(){
		//
    });

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'bubbles', function() {
		var defaults;
		defaults = function () {
			return {
				width: 940,
				height: 600,
				layout_gravity:-0.06,
				vis: null,
				force: null,
				damper: 0.1,
				circles: null,
				fill_color: d3.scale.ordinal().domain(["eh", "ev"]).range(["#a31031", "#beccae"]),
				max_amount: '',
				radius_scale: '',
				//tooltip: CustomTooltip("gates_tooltip", 240)
			};
		};
		return {
			restrict: 'E',
			controller: 'BubblesCtrl',
			scope: {
				chartdata: '=',
				direction: '=',
				gravity:'=',
				sizefactor: '='
			},
			link: function( scope, elem, attrs ){
				var options = angular.extend(defaults(), attrs);
				var nodes = [];

				var max_amount = d3.max(scope.chartdata, function (d) {
					return parseInt(d.value);
				});

				options.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85]);
				options.center = {
					x: options.width / 2,
					y: options.height / 2
				};
				options.cat_centers = {
        "ev": {
          x: options.width / 2,
          y: options.height / 2 + options.height / 40,
					damper: 0.1
        },

        "eh": {
          x: options.width / 2,
          y: options.height / 2 - options.height / 40,
					damper: 0.1
        }
      };
				var create_nodes = function () {
					nodes = [
						{
							id:1,
							radius:scope.chartdata.eh_hi /scope.sizefactor,
							value:scope.chartdata.eh_hi/scope.sizefactor,
							name: 'Health Impact',
							group: 'eh',
							x: options.center.x,
							y: options.center.y
						},
						{
							id:2,
							radius:scope.chartdata.eh_aq /scope.sizefactor,
							value:scope.chartdata.eh_aq /scope.sizefactor,
							name: 'Air Quality',
							group: 'eh',
							x: options.center.x,
							y: options.center.y
						},
						{
							id:3,
							radius:scope.chartdata.eh_ws/scope.sizefactor,
							value:scope.chartdata.eh_ws/scope.sizefactor,
							name: 'Water Sanitation',
							group: 'eh',
							x: options.center.x,
							y: options.center.y
						},
						{
							id:4,
							radius:scope.chartdata.ev_wr/scope.sizefactor,
							value:scope.chartdata.ev_wr/scope.sizefactor,
							name: 'Water Resources',
							group: 'ev',
							x: options.center.x,
							y: options.center.y
						},
						{
							id:5,
							radius:scope.chartdata.ev_ag/scope.sizefactor,
							value:scope.chartdata.ev_ag/scope.sizefactor,
							name: 'Agriculture',
							group: 'ev',
							x: options.center.x,
							y: options.center.y
						},
						{
							id:6,
							radius:scope.chartdata.ev_fo/scope.sizefactor,
							value:scope.chartdata.ev_fo/scope.sizefactor,
							name: 'Forest',
							group: 'ev',
							x: options.center.x,
							y: options.center.y
						},
						{
							id:7,
							radius:scope.chartdata.ev_fi/scope.sizefactor,
							value:scope.chartdata.ev_fi/scope.sizefactor,
							name: 'Fisheries',
							group: 'ev',
							x: options.center.x,
							y: options.center.y
						},
						{
							id:8,
							radius:scope.chartdata.ev_bd/scope.sizefactor,
							value:scope.chartdata.ev_bd/scope.sizefactor,
							name: 'Biodiversity and Habitat',
							group: 'ev',
							x: options.center.x,
							y: options.center.y
						},
						{
							id:9,
							radius:scope.chartdata.ev_ce/scope.sizefactor,
							value:scope.chartdata.ev_ce/scope.sizefactor,
							name: 'Climate and Energy',
							group: 'ev',
							x: options.center.x,
							y: options.center.y
						}
					];
					/*scope.chartdata.forEach((function (_this) {

						return function (d) {
							var node;
							node = {
								id: d.id,
								radius: d.value,
								value: d.value,
								name: d.name,
								org: 'bla',
								group: d.group,
								//year: d.start_year,
								x: options.center.x,
								y: options.center.y
							};
							return nodes.push(node);

						};
					})(this));
					return nodes.sort(function (a, b) {
						return b.value - a.value;
					});*/
				};
				var create_vis = function () {
					angular.element(elem).html('');
					options.vis = d3.select(elem[0]).append("svg").attr("width", options.width).attr("height", options.height).attr("id", "svg_vis");
					options.circles = options.vis.selectAll("circle").data(nodes, function (d) {
						return d.id;
					});

					options.circles.enter().append("circle").attr("r", 0).attr("fill", (function (d) {
						console.log(options.fill_color(d.group));
							return options.fill_color(d.group);
					})).attr("stroke-width", 2).attr("stroke", function (d) {
							return d3.rgb(options.fill_color(d.group)).darker();

					}).attr("id", function (d) {
						return "bubble_" + d.id;
					}).on("mouseover", function (d, i) {
						return show_details(d, i, this);
					}).on("mouseout", function (d, i) {
						return hide_details(d, i, this);
					});
					return options.circles.transition().duration(2000).attr("r", function (d) {
						return d.radius;
					});
				};
				var update_vis = function(){

				};
				var charge = function (d) {
					return -Math.pow(d.radius, 2.0) / 8;
				};
				var start = function () {
					return options.force = d3.layout.force().nodes(nodes).size([options.width, options.height]);
				};
				var display_group_all = function () {
					options.force.gravity(options.layout_gravity).charge(charge).friction(0.9).on("tick", (function (_this) {
						return function (e) {
							return options.circles.each(move_towards_center(e.alpha)).attr('cx', function (d) {
								return d.x;
							}).attr("cy", function (d) {
								return d.y;
							})
						}
					})(this));
					options.force.start();
					//return this.hide_years();
				};
				var display_by_year = function () {
					options.force.gravity(options.layout_gravity).charge(charge).friction(0.9).on("tick", (function (_this) {
						return function (e) {
							return options.circles.each(move_towards_cat(e.alpha)).attr("cx", function (d) {
								return d.x;
							}).attr("cy", function (d) {
								return d.y;
							});
						};
					})(this));
					options.force.start();
					//return this.display_years();
				};
				var move_towards_center = function (alpha) {
					return (function (_this) {
						return function (d) {
							d.x = d.x + (options.center.x - d.x) * (options.damper + 0.02) * alpha;
							d.y = d.y + (options.center.y - d.y) * (options.damper + 0.02) * alpha;
						}
					})(this);
				};
				var move_towards_top = function (alpha) {
					return (function (_this) {
						return function (d) {
							d.x = d.x + (options.center.x - d.x) * (options.damper + 0.02) * alpha * 1.1;
							d.y = d.y + (200 - d.y) * (options.damper + 0.02) * alpha * 1.1;
						}
					})(this);
				};
				var move_towards_cat = function (alpha) {
					return (function (_this) {
						return function (d) {
							var target;
          target = options.cat_centers[d.group];

          d.x = d.x + (target.x - d.x) * (target.damper + 0.02) * alpha * 1.1;
          return d.y = d.y + (target.y - d.y) * (target.damper + 0.02) * alpha * 1.1;
						}
					})(this);
				};
				/*var show_details = function (data, i, element) {
					var content;
					d3.select(element).attr("stroke", "black");
					content = "<span class=\"name\">Title:</span><span class=\"value\"> " + data.name + "</span><br/>";
					content += "<span class=\"name\">Value:</span><span class=\"value\"> " + (addCommas(data.value)) + "</span><br/>";
					content += "<span class=\"name\">Year:</span><span class=\"value\"> " + data.year + "</span>";
					return options.tooltip.showTooltip(content, d3.event);
				};

				var hide_details = function (data, i, element) {
					d3.select(element).attr("stroke", (function (_this) {
						return function (d) {
							return d3.rgb(options.fill_color(d.group)).darker();
						};
					})(this));
					return options.tooltip.hideTooltip();
				};*/


				scope.$watch('chartdata', function(data, oldData){
					if(data === oldData || !data){
						return;
					}
					create_nodes();
					create_vis();
					start();
					display_by_year();
				});

				scope.$watch('direction', function(oldD, newD){
					if(oldD === newD){
						return;
					}
					if(oldD == "all"){
						display_group_all();
					}
					else{
						display_by_year();
					}
				})
			}
		};
	});
})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'gradient', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/gradient/gradient.html',
			controller: 'GradientCtrl',
			link: function( $scope, element, $attrs ){
				//
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'GradientCtrl', function(){
		//
    });

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tYWluLmpzIiwiYXBwL3JvdXRlcy5qcyIsImFwcC9yb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvY2hhcnQuanMiLCJjb25maWcvbG9hZGluZ19iYXIuanMiLCJjb25maWcvcmVzdGFuZ3VsYXIuanMiLCJjb25maWcvdGhlbWUuanMiLCJmaWx0ZXJzL2NhcGl0YWxpemUuanMiLCJmaWx0ZXJzL2h1bWFuX3JlYWRhYmxlLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvTWFwLmpzIiwic2VydmljZXMvZGlhbG9nLmpzIiwic2VydmljZXMvdG9hc3QuanMiLCJhcHAvZGlhbG9ncy9kaWFsb2dzLmpzIiwiYXBwL2VsaXhpci9lbGl4aXIuanMiLCJhcHAvZXBpL2VwaS5qcyIsImFwcC9nZW5lcmF0b3JzL2dlbmVyYXRvcnMuanMiLCJhcHAvaGVhZGVyL2hlYWRlci5qcyIsImFwcC9qd3RfYXV0aC9qd3RfYXV0aC5qcyIsImFwcC9sYW5kaW5nL2xhbmRpbmcuanMiLCJhcHAvbWFwL21hcC5qcyIsImFwcC9sb2dpbi9sb2dpbi5qcyIsImFwcC9taXNjL21pc2MuanMiLCJhcHAvcmVzdF9hcGkvcmVzdF9hcGkuanMiLCJhcHAvc2lkZWJhci9zaWRlYmFyLmpzIiwiYXBwL3RhYnMvdGFicy5qcyIsImFwcC90b2FzdHMvdG9hc3RzLmpzIiwiYXBwL3Vuc3VwcG9ydGVkX2Jyb3dzZXIvdW5zdXBwb3J0ZWRfYnJvd3Nlci5qcyIsImRpYWxvZ3MvYWRkX3VzZXJzL2FkZF91c2Vycy5qcyIsImRpcmVjdGl2ZXMvZGF0YV9saXN0aW5nL2RhdGFfbGlzdGluZy5qcyIsImRpcmVjdGl2ZXMvZGF0YV9saXN0aW5nL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2J1YmJsZXMvYnViYmxlcy5qcyIsImRpcmVjdGl2ZXMvYnViYmxlcy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9ncmFkaWVudC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9ncmFkaWVudC9ncmFkaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxJQUFBLE1BQUEsUUFBQSxPQUFBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7Q0FJQSxRQUFBLE9BQUEsY0FBQSxDQUFBLGFBQUEsYUFBQTtDQUNBLFFBQUEsT0FBQSxtQkFBQSxDQUFBLGFBQUEsY0FBQSxhQUFBLGVBQUEsYUFBQSx1QkFBQSxjQUFBLG9CQUFBO0NBQ0EsUUFBQSxPQUFBLGVBQUE7Q0FDQSxRQUFBLE9BQUEsZ0JBQUEsQ0FBQSxhQUFBLGFBQUE7Q0FDQSxRQUFBLE9BQUEsa0JBQUE7Q0FDQSxRQUFBLE9BQUEsY0FBQTs7OztBQ25CQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxnREFBQSxTQUFBLGdCQUFBLG1CQUFBOztFQUVBLElBQUEsVUFBQSxTQUFBLFNBQUE7R0FDQSxPQUFBLGdCQUFBLFdBQUEsTUFBQSxXQUFBOzs7RUFHQSxtQkFBQSxVQUFBOztFQUVBO0lBQ0EsTUFBQSxPQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7Ozs7S0FJQSxRQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLE1BQUE7Ozs7SUFJQSxNQUFBLGVBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsV0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBLENBQUEsVUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLE9BQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLGVBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsWUFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBLENBQUEsVUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSxjQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUEsQ0FBQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLGFBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsY0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBLENBQUEsVUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSxlQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUEsQ0FBQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUEsQ0FBQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLGdCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUEsQ0FBQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLGNBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsZ0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsMkJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsWUFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBLENBQUEsVUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7Ozs7Ozs7O0FDdEpBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLG1CQUFBLFNBQUEsV0FBQTtFQUNBLFdBQUEsSUFBQSxxQkFBQSxTQUFBLE9BQUEsUUFBQTs7R0FFQSxJQUFBLFFBQUEsUUFBQSxRQUFBLEtBQUEsU0FBQTtJQUNBLFdBQUEsZUFBQSxRQUFBLEtBQUE7Ozs7O0VBS0EsV0FBQSxJQUFBLHNCQUFBLFNBQUEsT0FBQSxRQUFBO0dBQ0EsT0FBQSxNQUFBOzs7Ozs7QUNiQSxDQUFBLFdBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsY0FBQSx5QkFBQSxVQUFBLGNBQUE7OztRQUdBLGNBQUEsV0FBQTs7Ozs7QUNOQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSwyQkFBQSxVQUFBLGlCQUFBOztFQUVBLGdCQUFBLFdBQUE7R0FDQSxTQUFBLENBQUEsV0FBQTtHQUNBLFlBQUE7OztFQUdBLGdCQUFBLFdBQUEsUUFBQTtHQUNBLGFBQUE7Ozs7OztBQ1hBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLGlDQUFBLFVBQUEsc0JBQUE7RUFDQSxzQkFBQSxpQkFBQTs7Ozs7QUNKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxnQ0FBQSxTQUFBLHFCQUFBO0VBQ0E7R0FDQSxXQUFBOzs7OztBQ0xBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLDhCQUFBLFNBQUEsb0JBQUE7O0VBRUEsbUJBQUEsTUFBQTtHQUNBLGVBQUE7R0FDQSxjQUFBO0dBQ0EsWUFBQTs7Ozs7QUNSQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGNBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxPQUFBLEtBQUE7R0FDQSxPQUFBLENBQUEsQ0FBQSxDQUFBLFNBQUEsTUFBQSxRQUFBLHNCQUFBLFNBQUEsSUFBQTtJQUNBLE9BQUEsSUFBQSxPQUFBLEdBQUEsZ0JBQUEsSUFBQSxPQUFBLEdBQUE7UUFDQTs7Ozs7QUNQQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGlCQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsU0FBQSxLQUFBO0dBQ0EsS0FBQSxDQUFBLEtBQUE7SUFDQSxPQUFBOztHQUVBLElBQUEsUUFBQSxJQUFBLE1BQUE7R0FDQSxLQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxRQUFBLEtBQUE7SUFDQSxNQUFBLEtBQUEsTUFBQSxHQUFBLE9BQUEsR0FBQSxnQkFBQSxNQUFBLEdBQUEsTUFBQTs7R0FFQSxPQUFBLE1BQUEsS0FBQTs7OztBQ1pBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsc0JBQUEsVUFBQSxNQUFBO0VBQ0EsT0FBQSxVQUFBLE1BQUE7R0FDQSxPQUFBLEtBQUEsWUFBQTs7OztBQ0xBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsV0FBQSxXQUFBO0VBQ0EsT0FBQSxVQUFBLFFBQUE7R0FDQSxLQUFBLENBQUEsT0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQSxNQUFBLFVBQUEsR0FBQSxHQUFBLGdCQUFBLE1BQUEsVUFBQTs7Ozs7O0FDUkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsOEJBQUEsU0FBQSxZQUFBOztRQUVBLElBQUEsVUFBQTtRQUNBLE9BQUE7VUFDQSxnQkFBQSxTQUFBLEtBQUE7WUFDQSxVQUFBOztVQUVBLGdCQUFBLFVBQUE7WUFDQSxPQUFBOzs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsK0JBQUEsU0FBQSxVQUFBOztFQUVBLE9BQUE7R0FDQSxjQUFBLFNBQUEsVUFBQSxPQUFBOztJQUVBLElBQUEsVUFBQTtLQUNBLGFBQUEsb0JBQUEsV0FBQSxNQUFBLFdBQUE7OztJQUdBLElBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxPQUFBOzs7SUFHQSxPQUFBLFVBQUEsS0FBQTs7O0dBR0EsTUFBQSxVQUFBO0lBQ0EsT0FBQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsT0FBQSxRQUFBO0lBQ0EsVUFBQTtLQUNBLFVBQUE7T0FDQSxNQUFBO09BQ0EsUUFBQTtPQUNBLEdBQUE7Ozs7OztBQzVCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSw2QkFBQSxTQUFBLFNBQUE7O0VBRUEsSUFBQSxRQUFBO0dBQ0EsV0FBQTtHQUNBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLE1BQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxDQUFBLFFBQUE7S0FDQSxPQUFBOzs7SUFHQSxPQUFBLFNBQUE7S0FDQSxTQUFBO09BQ0EsUUFBQTtPQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7Ozs7OztBQ2xDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQ0FBQSxTQUFBLFFBQUEsY0FBQTtFQUNBLE9BQUEsY0FBQSxVQUFBO0dBQ0EsY0FBQSxNQUFBLDBCQUFBOzs7RUFHQSxPQUFBLGVBQUEsVUFBQTtHQUNBLGNBQUEsYUFBQSxhQUFBOzs7Ozs7QUNUQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxjQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGdGQUFBLFVBQUEsUUFBQSxZQUFBLGFBQUEsYUFBQSxZQUFBO0VBQ0EsT0FBQSxVQUFBO0VBQ0EsT0FBQSxTQUFBLENBQUEsV0FBQSxZQUFBLFNBQUEsU0FBQSxPQUFBLFFBQUE7RUFDQSxPQUFBLFNBQUEsQ0FBQSxZQUFBO0VBQ0EsT0FBQSxPQUFBO0dBQ0EsQ0FBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQTtHQUNBLENBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUE7O0VBRUEsSUFBQSxNQUFBLFlBQUEsSUFBQTtFQUNBLElBQUEsVUFBQSxLQUFBLFVBQUEsTUFBQTtHQUNBLE9BQUEsTUFBQTtHQUNBLE9BQUE7O0VBRUEsT0FBQSxhQUFBLFVBQUEsS0FBQTtHQUNBLE9BQUEsVUFBQTs7RUFFQSxPQUFBLFlBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxPQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsT0FBQSxRQUFBLE9BQUEsS0FBQTs7RUFFQSxPQUFBLGNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxPQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsT0FBQSxRQUFBLGlCQUFBLElBQUEsa0JBQUE7O0VBRUEsSUFBQSxrQkFBQSxVQUFBLE1BQUE7R0FDQSxJQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtJQUNBLElBQUEsSUFBQSxXQUFBLE1BQUE7S0FDQSxTQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxJQUFBLGVBQUEsVUFBQSxRQUFBO0dBQ0EsT0FBQSxTQUFBLFNBQUEsY0FBQTtHQUNBLE9BQUEsT0FBQSxRQUFBO0dBQ0EsT0FBQSxPQUFBLFNBQUE7R0FDQSxPQUFBLE1BQUEsT0FBQSxPQUFBLFdBQUE7R0FDQSxJQUFBLFdBQUEsT0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxTQUFBLGFBQUEsTUFBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsT0FBQSxJQUFBLFlBQUE7R0FDQSxPQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLE9BQUEsVUFBQSxPQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBO0dBQ0EsU0FBQSxxQkFBQSxRQUFBLEdBQUEsWUFBQSxPQUFBOztFQUVBO0VBQ0EsT0FBQSxnQkFBQSxZQUFBOztHQUVBLFFBQUEsSUFBQSxXQUFBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7O0lBRUEsSUFBQSxRQUFBOztJQUVBLElBQUEsU0FBQTtJQUNBLElBQUEsTUFBQTtJQUNBLElBQUEsT0FBQSxvR0FBQTtJQUNBLElBQUEsWUFBQSxJQUFBLEVBQUEsVUFBQSxVQUFBO0tBQ0EsS0FBQTtLQUNBLE9BQUE7S0FDQSxpQkFBQSxDQUFBO0tBQ0EsYUFBQTtLQUNBLFNBQUEsVUFBQSxLQUFBLEdBQUE7O01BRUEsR0FBQSxPQUFBLFFBQUEsV0FBQSxJQUFBLFFBQUEsV0FBQSxNQUFBO09BQ0EsSUFBQSxNQUFBLElBQUE7T0FDQSxJQUFBLE1BQUEsSUFBQSxFQUFBLE1BQUEsQ0FBQSxJQUFBOztNQUVBLE9BQUEsVUFBQSxnQkFBQSxJQUFBLFFBQUEsV0FBQTs7S0FFQSxzQkFBQSxVQUFBLFNBQUE7O01BRUEsT0FBQSxRQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7S0FhQSxRQUFBLFVBQUEsU0FBQSxTQUFBOztNQUVBLElBQUEsUUFBQSxNQUFBLFNBQUEsV0FBQSxRQUFBLE1BQUEsU0FBQSx3QkFBQTs7T0FFQSxJQUFBLFFBQUEsV0FBQSxlQUFBLEtBQUEsUUFBQSxXQUFBLGVBQUEsS0FBQSxRQUFBLFdBQUEsZUFBQSxHQUFBO1FBQ0EsT0FBQTtjQUNBO1FBQ0EsT0FBQTs7OztNQUlBLE9BQUE7OztLQUdBLE9BQUEsVUFBQSxTQUFBO01BQ0EsSUFBQSxRQUFBO01BQ0EsSUFBQSxTQUFBLGdCQUFBLFFBQUEsV0FBQTtNQUNBLElBQUEsT0FBQSxRQUFBO01BQ0EsUUFBQTtNQUNBLEtBQUE7T0FDQSxNQUFBLFFBQUE7T0FDQSxNQUFBLFNBQUE7T0FDQSxNQUFBLFdBQUE7UUFDQSxPQUFBO1FBQ0EsUUFBQTs7T0FFQTtNQUNBLEtBQUE7T0FDQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE9BQUE7T0FDQSxNQUFBLFdBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7T0FFQTtNQUNBLEtBQUE7T0FDQSxJQUFBLE9BQUEsT0FBQTtRQUNBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxPQUFBLFNBQUE7UUFDQSxJQUFBLFFBQUEsVUFBQSxPQUFBLFFBQUEsWUFBQSxPQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxPQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsT0FBQSxRQUFBLFVBQUEsS0FBQTtRQUNBLE1BQUEsUUFBQTtRQUNBLE1BQUEsVUFBQTtTQUNBLE9BQUE7U0FDQSxNQUFBOztRQUVBLE1BQUEsV0FBQTtTQUNBLE9BQUE7U0FDQSxTQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7OztRQUdBOztXQUVBO1FBQ0EsTUFBQSxRQUFBO1FBQ0EsTUFBQSxVQUFBO1NBQ0EsT0FBQTtTQUNBLE1BQUE7Ozs7OztNQU1BLE1BQUEsYUFBQSxVQUFBLFlBQUE7T0FDQSxJQUFBLEtBQUEsV0FBQTs7Ozs7TUFLQSxNQUFBLGNBQUEsVUFBQSxZQUFBLFVBQUE7T0FDQSxJQUFBLFFBQUE7UUFDQSxNQUFBLFNBQUE7UUFDQSxVQUFBLENBQUEsSUFBQTtRQUNBLFVBQUE7UUFDQSxrQkFBQTs7T0FFQSxPQUFBOzs7O01BSUEsT0FBQTs7Ozs7Ozs7Ozs7O0tBWUEsV0FBQSxVQUFBLFdBQUE7TUFDQSxJQUFBLFVBQUEsUUFBQSxZQUFBLENBQUEsR0FBQTtPQUNBLE9BQUEsVUFBQSxRQUFBLFVBQUE7O01BRUEsT0FBQSxZQUFBOzs7O0lBSUEsTUFBQSxZQUFBO0lBQ0EsSUFBQSxTQUFBOzs7Ozs7QUNuTUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsa0JBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUNBQUEsU0FBQSxRQUFBLFdBQUE7O0VBRUEsT0FBQSxPQUFBLFVBQUE7R0FDQSxPQUFBLFdBQUE7S0FDQSxTQUFBLFFBQUE7R0FDQSxPQUFBLGVBQUEsV0FBQTs7Ozs7Ozs7QUNSQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrREFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBOztFQUVBLElBQUEsY0FBQTs7RUFFQSxPQUFBLGVBQUEsVUFBQTs7R0FFQSxNQUFBLE1BQUEsYUFBQSxLQUFBLFVBQUEsS0FBQTs7Ozs7Ozs7RUFRQSxPQUFBLFVBQUEsVUFBQTtHQUNBLFlBQUEsSUFBQSxxQkFBQSxNQUFBLEtBQUEsVUFBQSxTQUFBOztNQUVBLFVBQUEsTUFBQTs7Ozs7Ozs7O0FDcEJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlHQUFBLFNBQUEsUUFBQSxVQUFBLFdBQUEsV0FBQSxjQUFBLGNBQUE7O0VBRUEsT0FBQSxhQUFBO0VBQ0EsT0FBQSxPQUFBOztFQUVBLElBQUEsUUFBQTtJQUNBLFVBQUEsWUFBQSxXQUFBLFNBQUEsWUFBQSxZQUFBLFdBQUEsaUJBQUEsU0FBQTtJQUNBLGFBQUEsb0JBQUEsYUFBQSxPQUFBLG9CQUFBLFdBQUEsb0JBQUEsV0FBQTtJQUNBLHNCQUFBLFNBQUEscUJBQUEsa0JBQUEsaUJBQUEsY0FBQSxjQUFBO0lBQ0EsWUFBQSxrQkFBQSxhQUFBLGVBQUEsY0FBQSxXQUFBLE9BQUEsdUJBQUE7SUFDQSxhQUFBLFFBQUEsUUFBQSxhQUFBLFdBQUEsVUFBQSxTQUFBLGVBQUEsV0FBQSxlQUFBO0lBQ0EsUUFBQSx5QkFBQSxRQUFBLGVBQUEsZUFBQSxtQkFBQSxhQUFBO0lBQ0EsYUFBQSxpQkFBQSxlQUFBLFdBQUEsa0JBQUEsZUFBQTtJQUNBLHdCQUFBLGdCQUFBLHlCQUFBLGFBQUEsZUFBQSxpQkFBQTtJQUNBLFFBQUEsV0FBQSxzQkFBQSxTQUFBLFdBQUEsU0FBQSxjQUFBLFFBQUEsU0FBQSxTQUFBO0lBQ0EsVUFBQSxrQkFBQSxjQUFBLGdCQUFBLGFBQUEsU0FBQSxtQkFBQSxTQUFBO0lBQ0EsbUJBQUEsY0FBQSxlQUFBLGlCQUFBLGVBQUEsY0FBQSxZQUFBLGNBQUE7SUFDQSxTQUFBLGNBQUEsYUFBQSxXQUFBLGdCQUFBLGFBQUEsUUFBQSxTQUFBLFFBQUE7SUFDQSxzQkFBQSxZQUFBLFVBQUEsU0FBQTs7R0FFQSxVQUFBOztFQUVBLFVBQUEsVUFBQTtHQUNBLE9BQUEsT0FBQSxNQUFBLEVBQUE7R0FDQSxJQUFBLFVBQUEsSUFBQTtJQUNBLFVBQUE7O0tBRUE7Ozs7OztBQzlCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxzRkFBQSxVQUFBLFFBQUEsWUFBQSxVQUFBLFlBQUEsYUFBQSxPQUFBOztFQUVBLElBQUEsU0FBQTs7Ozs7Ozs7Ozs7OztFQWFBLFFBQUEsT0FBQSxRQUFBO0dBQ0EsUUFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTs7R0FFQSxRQUFBO0lBQ0EsWUFBQTtLQUNBLEtBQUE7TUFDQSxNQUFBO01BQ0EsS0FBQSxnRkFBQTtNQUNBLE1BQUE7OztJQUdBLFVBQUE7S0FDQSxjQUFBO01BQ0EsTUFBQTtNQUNBLE1BQUE7TUFDQSxLQUFBO01BQ0EsU0FBQTs7Ozs7RUFLQSxPQUFBLFdBQUEsVUFBQSxJQUFBO0dBQ0EsSUFBQSxNQUFBLCtCQUFBO0dBQ0EsTUFBQSxJQUFBLEtBQUEsUUFBQSxVQUFBLEtBQUE7SUFDQSxPQUFBLFNBQUE7S0FDQSxLQUFBLElBQUE7S0FDQSxLQUFBLElBQUE7S0FDQSxNQUFBOztJQUVBLE9BQUEsS0FBQSxJQUFBOzs7O0VBSUEsT0FBQSxTQUFBO0VBQ0EsT0FBQSxnQkFBQTtFQUNBLE9BQUEsT0FBQTtFQUNBLE9BQUEsSUFBQSx3Q0FBQSxVQUFBLE9BQUEsY0FBQTs7R0FFQSxPQUFBLGdCQUFBLGFBQUEsS0FBQTtHQUNBLE9BQUEsT0FBQSwyQkFBQSxhQUFBLEtBQUE7OztFQUdBLE9BQUEsSUFBQSx1Q0FBQSxVQUFBLE9BQUEsY0FBQTtHQUNBLE9BQUEsZ0JBQUE7R0FDQSxPQUFBLE9BQUE7O0VBRUEsV0FBQSxlQUFBLFlBQUEsT0FBQTs7Ozs7QUNuRUEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsYUFBQSxXQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxZQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGVBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0NBQUEsU0FBQSxRQUFBLE9BQUE7Ozs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxpQkFBQSxVQUFBOzs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlDQUFBLFNBQUEsUUFBQSxhQUFBOztFQUVBLE9BQUEsZUFBQSxVQUFBO0dBQ0EsYUFBQSxLQUFBOzs7RUFHQSxPQUFBLGFBQUEsVUFBQTtHQUNBLGFBQUEsTUFBQTs7Ozs7OztBQ1ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRDQUFBLFNBQUEsUUFBQSxjQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBOztZQUVBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ1hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLGVBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBOzs7Ozs7Ozs7QUNUQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxlQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLElBQUE7RUFDQSxXQUFBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxlQUFBLENBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxTQUFBO0lBQ0EsWUFBQSxHQUFBLE1BQUEsVUFBQSxPQUFBLENBQUEsTUFBQSxPQUFBLE1BQUEsQ0FBQSxXQUFBO0lBQ0EsWUFBQTtJQUNBLGNBQUE7Ozs7RUFJQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsV0FBQTtJQUNBLFdBQUE7SUFDQSxRQUFBO0lBQ0EsWUFBQTs7R0FFQSxNQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUE7SUFDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxJQUFBLFFBQUE7O0lBRUEsSUFBQSxhQUFBLEdBQUEsSUFBQSxNQUFBLFdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxTQUFBLEVBQUE7OztJQUdBLFFBQUEsZUFBQSxHQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsYUFBQSxNQUFBLENBQUEsR0FBQTtJQUNBLFFBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxRQUFBO0tBQ0EsR0FBQSxRQUFBLFNBQUE7O0lBRUEsUUFBQSxjQUFBO1FBQ0EsTUFBQTtVQUNBLEdBQUEsUUFBQSxRQUFBO1VBQ0EsR0FBQSxRQUFBLFNBQUEsSUFBQSxRQUFBLFNBQUE7S0FDQSxRQUFBOzs7UUFHQSxNQUFBO1VBQ0EsR0FBQSxRQUFBLFFBQUE7VUFDQSxHQUFBLFFBQUEsU0FBQSxJQUFBLFFBQUEsU0FBQTtLQUNBLFFBQUE7OztJQUdBLElBQUEsZUFBQSxZQUFBO0tBQ0EsUUFBQTtNQUNBO09BQ0EsR0FBQTtPQUNBLE9BQUEsTUFBQSxVQUFBLE9BQUEsTUFBQTtPQUNBLE1BQUEsTUFBQSxVQUFBLE1BQUEsTUFBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsR0FBQSxRQUFBLE9BQUE7T0FDQSxHQUFBLFFBQUEsT0FBQTs7TUFFQTtPQUNBLEdBQUE7T0FDQSxPQUFBLE1BQUEsVUFBQSxPQUFBLE1BQUE7T0FDQSxNQUFBLE1BQUEsVUFBQSxPQUFBLE1BQUE7T0FDQSxNQUFBO09BQ0EsT0FBQTtPQUNBLEdBQUEsUUFBQSxPQUFBO09BQ0EsR0FBQSxRQUFBLE9BQUE7O01BRUE7T0FDQSxHQUFBO09BQ0EsT0FBQSxNQUFBLFVBQUEsTUFBQSxNQUFBO09BQ0EsTUFBQSxNQUFBLFVBQUEsTUFBQSxNQUFBO09BQ0EsTUFBQTtPQUNBLE9BQUE7T0FDQSxHQUFBLFFBQUEsT0FBQTtPQUNBLEdBQUEsUUFBQSxPQUFBOztNQUVBO09BQ0EsR0FBQTtPQUNBLE9BQUEsTUFBQSxVQUFBLE1BQUEsTUFBQTtPQUNBLE1BQUEsTUFBQSxVQUFBLE1BQUEsTUFBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsR0FBQSxRQUFBLE9BQUE7T0FDQSxHQUFBLFFBQUEsT0FBQTs7TUFFQTtPQUNBLEdBQUE7T0FDQSxPQUFBLE1BQUEsVUFBQSxNQUFBLE1BQUE7T0FDQSxNQUFBLE1BQUEsVUFBQSxNQUFBLE1BQUE7T0FDQSxNQUFBO09BQ0EsT0FBQTtPQUNBLEdBQUEsUUFBQSxPQUFBO09BQ0EsR0FBQSxRQUFBLE9BQUE7O01BRUE7T0FDQSxHQUFBO09BQ0EsT0FBQSxNQUFBLFVBQUEsTUFBQSxNQUFBO09BQ0EsTUFBQSxNQUFBLFVBQUEsTUFBQSxNQUFBO09BQ0EsTUFBQTtPQUNBLE9BQUE7T0FDQSxHQUFBLFFBQUEsT0FBQTtPQUNBLEdBQUEsUUFBQSxPQUFBOztNQUVBO09BQ0EsR0FBQTtPQUNBLE9BQUEsTUFBQSxVQUFBLE1BQUEsTUFBQTtPQUNBLE1BQUEsTUFBQSxVQUFBLE1BQUEsTUFBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsR0FBQSxRQUFBLE9BQUE7T0FDQSxHQUFBLFFBQUEsT0FBQTs7TUFFQTtPQUNBLEdBQUE7T0FDQSxPQUFBLE1BQUEsVUFBQSxNQUFBLE1BQUE7T0FDQSxNQUFBLE1BQUEsVUFBQSxNQUFBLE1BQUE7T0FDQSxNQUFBO09BQ0EsT0FBQTtPQUNBLEdBQUEsUUFBQSxPQUFBO09BQ0EsR0FBQSxRQUFBLE9BQUE7O01BRUE7T0FDQSxHQUFBO09BQ0EsT0FBQSxNQUFBLFVBQUEsTUFBQSxNQUFBO09BQ0EsTUFBQSxNQUFBLFVBQUEsTUFBQSxNQUFBO09BQ0EsTUFBQTtPQUNBLE9BQUE7T0FDQSxHQUFBLFFBQUEsT0FBQTtPQUNBLEdBQUEsUUFBQSxPQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTBCQSxJQUFBLGFBQUEsWUFBQTtLQUNBLFFBQUEsUUFBQSxNQUFBLEtBQUE7S0FDQSxRQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLFFBQUEsT0FBQSxLQUFBLFVBQUEsUUFBQSxRQUFBLEtBQUEsTUFBQTtLQUNBLFFBQUEsVUFBQSxRQUFBLElBQUEsVUFBQSxVQUFBLEtBQUEsT0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7OztLQUdBLFFBQUEsUUFBQSxRQUFBLE9BQUEsVUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsUUFBQSxJQUFBLFFBQUEsV0FBQSxFQUFBO09BQ0EsT0FBQSxRQUFBLFdBQUEsRUFBQTtTQUNBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLFVBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxHQUFBLElBQUEsUUFBQSxXQUFBLEVBQUEsUUFBQTs7UUFFQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxZQUFBLEVBQUE7UUFDQSxHQUFBLGFBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLGFBQUEsR0FBQSxHQUFBO1FBQ0EsR0FBQSxZQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTs7S0FFQSxPQUFBLFFBQUEsUUFBQSxhQUFBLFNBQUEsTUFBQSxLQUFBLEtBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBOzs7SUFHQSxJQUFBLGFBQUEsVUFBQTs7O0lBR0EsSUFBQSxTQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsQ0FBQSxLQUFBLElBQUEsRUFBQSxRQUFBLE9BQUE7O0lBRUEsSUFBQSxRQUFBLFlBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQSxHQUFBLE9BQUEsUUFBQSxNQUFBLE9BQUEsS0FBQSxDQUFBLFFBQUEsT0FBQSxRQUFBOztJQUVBLElBQUEsb0JBQUEsWUFBQTtLQUNBLFFBQUEsTUFBQSxRQUFBLFFBQUEsZ0JBQUEsT0FBQSxRQUFBLFNBQUEsS0FBQSxHQUFBLFFBQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsUUFBQSxRQUFBLEtBQUEsb0JBQUEsRUFBQSxRQUFBLEtBQUEsTUFBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLEVBQUE7VUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBO1FBQ0EsT0FBQSxFQUFBOzs7UUFHQTtLQUNBLFFBQUEsTUFBQTs7O0lBR0EsSUFBQSxrQkFBQSxZQUFBO0tBQ0EsUUFBQSxNQUFBLFFBQUEsUUFBQSxnQkFBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEdBQUEsUUFBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxRQUFBLFFBQUEsS0FBQSxpQkFBQSxFQUFBLFFBQUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtRQUNBLE9BQUEsRUFBQTtVQUNBLEtBQUEsTUFBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLEVBQUE7OztRQUdBO0tBQ0EsUUFBQSxNQUFBOzs7SUFHQSxJQUFBLHNCQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsUUFBQSxPQUFBLElBQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsbUJBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxtQkFBQSxVQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsVUFBQSxPQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxJQUFBO1VBQ0EsU0FBQSxRQUFBLFlBQUEsRUFBQTs7VUFFQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBO1VBQ0EsT0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQkEsTUFBQSxPQUFBLGFBQUEsU0FBQSxNQUFBLFFBQUE7S0FDQSxHQUFBLFNBQUEsV0FBQSxDQUFBLEtBQUE7TUFDQTs7S0FFQTtLQUNBO0tBQ0E7S0FDQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsU0FBQSxNQUFBLEtBQUE7S0FDQSxHQUFBLFNBQUEsS0FBQTtNQUNBOztLQUVBLEdBQUEsUUFBQSxNQUFBO01BQ0E7O1NBRUE7TUFDQTs7Ozs7Ozs7QUM3UkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsWUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7Ozs7Ozs7OztBQ1RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGdCQUFBLFVBQUE7Ozs7O0FBS0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyxcblx0XHRbXG5cdFx0J2FwcC5jb250cm9sbGVycycsXG5cdFx0J2FwcC5maWx0ZXJzJyxcblx0XHQnYXBwLnNlcnZpY2VzJyxcblx0XHQnYXBwLmRpcmVjdGl2ZXMnLFxuXHRcdCdhcHAucm91dGVzJyxcblx0XHQnYXBwLmNvbmZpZycsXG5cdFx0XSk7XG5cblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycsIFsndWkucm91dGVyJywgJ25nU3RvcmFnZScsICdzYXRlbGxpemVyJ10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgWyd1aS5yb3V0ZXInLCAnbmdNYXRlcmlhbCcsICduZ1N0b3JhZ2UnLCAncmVzdGFuZ3VsYXInLCAnbmdNZEljb25zJywgJ2FuZ3VsYXItbG9hZGluZy1iYXInLCAnbmdNZXNzYWdlcycsIFwibGVhZmxldC1kaXJlY3RpdmVcIiwnY2hhcnQuanMnXSk7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycsIFtdKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFsndWkucm91dGVyJywgJ25nU3RvcmFnZScsICdyZXN0YW5ndWxhciddKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgW10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycsIFtdKTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKXtcblxuXHRcdHZhciBnZXRWaWV3ID0gZnVuY3Rpb24odmlld05hbWUpe1xuXHRcdFx0cmV0dXJuICcvdmlld3MvYXBwLycgKyB2aWV3TmFtZSArICcvJyArIHZpZXdOYW1lICsgJy5odG1sJztcblx0XHR9O1xuXG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG5cdFx0JHN0YXRlUHJvdmlkZXJcblx0XHRcdC5zdGF0ZSgnYXBwJywge1xuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0LypcdHNpZGViYXI6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdzaWRlYmFyJylcblx0XHRcdFx0XHR9LCovXG5cdFx0XHRcdFx0aGVhZGVyOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaGVhZGVyJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1haW46IHt9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cblx0XHRcdC5zdGF0ZSgnYXBwLmxhbmRpbmcnLCB7XG5cdFx0XHRcdHVybDogJy8nLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdPdmVydmlldyd9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsYW5kaW5nJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5lcGknLCB7XG5cdFx0XHRcdHVybDogJy9lcGknLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdFbnZpcm9ubWVudCBQZXJmb3JtYW5jZSBJbmRleCd9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdlcGknKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21hcEAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdtYXAnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluc3RhbGwnLCB7XG5cdFx0XHRcdHVybDogJy9pbnN0YWxsJyxcblx0XHRcdFx0ZGF0YToge3BhZ2VOYW1lOiAnSW5zdGFsbCd9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbnN0YWxsJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC50YWJzJywge1xuXHRcdFx0XHR1cmw6ICcvZmVhdHVyZXMnLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdGZWF0dXJlcyd9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd0YWJzJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5kZXBsb3knLCB7XG5cdFx0XHRcdHVybDogJy9kZXBsb3knLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdEZXBsb3knfSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnZGVwbG95Jylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC50aGVtZScsIHtcblx0XHRcdFx0dXJsOiAnL3RoZW1lJyxcblx0XHRcdFx0ZGF0YToge3BhZ2VOYW1lOiAnVGhlbWUnfSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygndGhlbWUnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnRvYXN0cycsIHtcblx0XHRcdFx0dXJsOiAnL3RvYXN0cycsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ1RvYXN0cyd9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd0b2FzdHMnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmRpYWxvZ3MnLCB7XG5cdFx0XHRcdHVybDogJy9kaWFsb2dzJyxcblx0XHRcdFx0ZGF0YToge3BhZ2VOYW1lOiAnRGlhbG9ncyd9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdkaWFsb2dzJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5nZW5lcmF0b3JzJywge1xuXHRcdFx0XHR1cmw6ICcvZ2VuZXJhdG9ycycsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ0FydGlzYW4gZ2VuZXJhdG9ycyd9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdnZW5lcmF0b3JzJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5qd3RfYXV0aCcsIHtcblx0XHRcdFx0dXJsOiAnL2p3dF9hdXRoJyxcblx0XHRcdFx0ZGF0YToge3BhZ2VOYW1lOiAnSlNPTiBXZWIgVG9rZW4gQXV0aGVudGljYXRpb24nfSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0Vmlldygnand0X2F1dGgnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmVsaXhpcicsIHtcblx0XHRcdFx0dXJsOiAnL2VsaXhpcicsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ0VsaXhpcid9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdlbGl4aXInKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnJlc3RfYXBpJywge1xuXHRcdFx0XHR1cmw6ICcvcmVzdF9hcGknLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdSRVNUIEFQSSd9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXN0X2FwaScpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudW5zdXBwb3J0ZWRfYnJvd3NlcicsIHtcblx0XHRcdFx0dXJsOiAnL3Vuc3VwcG9ydGVkX2Jyb3dzZXInLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdVbnN1cHBvcnRlZCBCcm93c2VyJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3Vuc3VwcG9ydGVkX2Jyb3dzZXInKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLm1pc2MnLCB7XG5cdFx0XHRcdHVybDogJy9taXNjJyxcblx0XHRcdFx0ZGF0YToge3BhZ2VOYW1lOiAnTWlzY2VsbGFuZW91cyBmZWF0dXJlcyd9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdtaXNjJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cblxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSl7XG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cblx0XHRcdGlmICh0b1N0YXRlLmRhdGEgJiYgdG9TdGF0ZS5kYXRhLnBhZ2VOYW1lKXtcblx0XHRcdFx0JHJvb3RTY29wZS5jdXJyZW50X3BhZ2UgPSB0b1N0YXRlLmRhdGEucGFnZU5hbWU7XG5cdFx0XHR9XG5cblxuXHRcdH0pO1xuXHRcdCRyb290U2NvcGUuJG9uKFwiJHZpZXdDb250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcblx0XHRcdHdpbmRvdy5QcmlzbS5oaWdobGlnaHRBbGwoKTtcblx0XHR9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoJGF1dGhQcm92aWRlcil7XG4gICAgICAgIC8vIFNhdGVsbGl6ZXIgY29uZmlndXJhdGlvbiB0aGF0IHNwZWNpZmllcyB3aGljaCBBUElcbiAgICAgICAgLy8gcm91dGUgdGhlIEpXVCBzaG91bGQgYmUgcmV0cmlldmVkIGZyb21cbiAgICAgICAgJGF1dGhQcm92aWRlci5sb2dpblVybCA9ICcvYXBpLzEvYXV0aGVudGljYXRlL2F1dGgnO1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24gKENoYXJ0SnNQcm92aWRlcikge1xuXHRcdC8vXG5cdFx0Q2hhcnRKc1Byb3ZpZGVyLnNldE9wdGlvbnMoe1xuXHRcdFx0Y29sb3VyczogWycjRkY1MjUyJywgJyNGRjhBODAnXSxcblx0XHRcdHJlc3BvbnNpdmU6IHRydWVcblx0XHR9KTtcblx0XHQvLyBDb25maWd1cmUgYWxsIGxpbmUgY2hhcnRzXG5cdFx0Q2hhcnRKc1Byb3ZpZGVyLnNldE9wdGlvbnMoJ0xpbmUnLCB7XG5cdFx0XHRkYXRhc2V0RmlsbDogZmFsc2Vcblx0XHR9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uIChjZnBMb2FkaW5nQmFyUHJvdmlkZXIpe1xuXHRcdGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyggZnVuY3Rpb24oUmVzdGFuZ3VsYXJQcm92aWRlcikge1xuXHRcdFJlc3Rhbmd1bGFyUHJvdmlkZXJcblx0XHQuc2V0QmFzZVVybCgnL2FwaS8xLycpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIpIHtcblx0XHQvKiBGb3IgbW9yZSBpbmZvLCB2aXNpdCBodHRwczovL21hdGVyaWFsLmFuZ3VsYXJqcy5vcmcvIy9UaGVtaW5nLzAxX2ludHJvZHVjdGlvbiAqL1xuXHRcdCRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG5cdFx0LnByaW1hcnlQYWxldHRlKCdpbmRpZ28nKVxuXHRcdC5hY2NlbnRQYWxldHRlKCdncmV5Jylcblx0XHQud2FyblBhbGV0dGUoJ3JlZCcpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdjYXBpdGFsaXplJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQsIGFsbCkge1xuXHRcdFx0cmV0dXJuICghIWlucHV0KSA/IGlucHV0LnJlcGxhY2UoLyhbXlxcV19dK1teXFxzLV0qKSAqL2csZnVuY3Rpb24odHh0KXtcblx0XHRcdFx0cmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcblx0XHRcdH0pIDogJyc7XG5cdFx0fTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2h1bWFuUmVhZGFibGUnLCBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBmdW5jdGlvbiBodW1hbml6ZShzdHIpIHtcblx0XHRcdGlmICggIXN0ciApe1xuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZnJhZ3MgPSBzdHIuc3BsaXQoJ18nKTtcblx0XHRcdGZvciAodmFyIGk9MDsgaTxmcmFncy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRmcmFnc1tpXSA9IGZyYWdzW2ldLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZnJhZ3NbaV0uc2xpY2UoMSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZnJhZ3Muam9pbignICcpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAndHJ1c3RIdG1sJywgZnVuY3Rpb24oICRzY2UgKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGh0bWwgKXtcblx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGh0bWwpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd1Y2ZpcnN0JywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBpbnB1dCApIHtcblx0XHRcdGlmICggIWlucHV0ICl7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGlucHV0LnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgaW5wdXQuc3Vic3RyaW5nKDEpO1xuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnTWFwU2VydmljZScsIGZ1bmN0aW9uKGxlYWZsZXREYXRhKXtcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIGxlYWZsZXQgPSB7fTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzZXRMZWFmbGV0RGF0YTogZnVuY3Rpb24obGVhZil7XG4gICAgICAgICAgICBsZWFmbGV0ID0gbGVhZmxldDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldExlYWZsZXREYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIGxlYWZsZXQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRGlhbG9nU2VydmljZScsIGZ1bmN0aW9uKCRtZERpYWxvZyl7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZnJvbVRlbXBsYXRlOiBmdW5jdGlvbih0ZW1wbGF0ZSwgJHNjb3BlKXtcblxuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9kaWFsb2dzLycgKyB0ZW1wbGF0ZSArICcvJyArIHRlbXBsYXRlICsgJy5odG1sJ1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGlmICgkc2NvcGUpe1xuXHRcdFx0XHRcdG9wdGlvbnMuc2NvcGUgPSAkc2NvcGUuJG5ldygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5zaG93KG9wdGlvbnMpO1xuXHRcdFx0fSxcblxuXHRcdFx0aGlkZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5oaWRlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRhbGVydDogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpe1xuXHRcdFx0XHQkbWREaWFsb2cuc2hvdyhcblx0XHRcdFx0XHQkbWREaWFsb2cuYWxlcnQoKVxuXHRcdFx0XHRcdFx0LnRpdGxlKHRpdGxlKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5vaygnT2snKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnVG9hc3RTZXJ2aWNlJywgZnVuY3Rpb24oJG1kVG9hc3Qpe1xuXG5cdFx0dmFyIGRlbGF5ID0gNjAwMCxcblx0XHRcdHBvc2l0aW9uID0gJ3RvcCByaWdodCcsXG5cdFx0XHRhY3Rpb24gPSAnT0snO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3c6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kVG9hc3Quc2hvdyhcblx0XHRcdFx0XHQkbWRUb2FzdC5zaW1wbGUoKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5wb3NpdGlvbihwb3NpdGlvbilcblx0XHRcdFx0XHRcdC50aGVtZSgnd2FybicpXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcblx0XHRcdFx0XHRcdC5oaWRlRGVsYXkoZGVsYXkpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRGlhbG9nc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuXHRcdCRzY29wZS5hbGVydERpYWxvZyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmFsZXJ0KCdUaGlzIGlzIGFuIGFsZXJ0IHRpdGxlJywgJ1lvdSBjYW4gc3BlY2lmeSBzb21lIGRlc2NyaXB0aW9uIHRleHQgaW4gaGVyZS4nKTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLmN1c3RvbURpYWxvZyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnYWRkX3VzZXJzJywgJHNjb3BlKTtcblx0XHR9O1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0VsaXhpckN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0VwaUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCBSZXN0YW5ndWxhciwgbGVhZmxldERhdGEsIE1hcFNlcnZpY2UpIHtcblx0XHQkc2NvcGUuY3VycmVudCA9IFwiXCI7XG5cdFx0JHNjb3BlLmxhYmVscyA9IFtcIkphbnVhcnlcIiwgXCJGZWJydWFyeVwiLCBcIk1hcmNoXCIsIFwiQXByaWxcIiwgXCJNYXlcIiwgXCJKdW5lXCIsIFwiSnVseVwiXTtcblx0XHQkc2NvcGUuc2VyaWVzID0gWydTZXJpZXMgQScsICdTZXJpZXMgQiddO1xuXHRcdCRzY29wZS5kYXRhID0gW1xuXHRcdFx0WzY1LCA1OSwgODAsIDgxLCA1NiwgNTUsIDQwXSxcblx0XHRcdFsyOCwgNDgsIDQwLCAxOSwgODYsIDI3LCA5MF1cblx0XHRdO1xuXHRcdHZhciBlcGkgPSBSZXN0YW5ndWxhci5hbGwoJ2VwaScpO1xuXHRcdGVwaS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0JHNjb3BlLmVwaSA9IGRhdGE7XG5cdFx0XHQkc2NvcGUuZHJhd0NvdW50cmllcygpO1xuXHRcdH0pO1xuXHRcdCRzY29wZS5zZXRDdXJyZW50ID0gZnVuY3Rpb24gKG5hdCkge1xuXHRcdFx0JHNjb3BlLmN1cnJlbnQgPSBuYXQ7XG5cdFx0fTtcblx0XHQkc2NvcGUuZ2V0T2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKCEkc2NvcGUuY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblx0XHRcdHJldHVybiAkc2NvcGUuY3VycmVudC5yYW5rIC0gMiB8fCAwO1xuXHRcdH07XG5cdFx0JHNjb3BlLmdldFRlbmRlbmN5ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKCEkc2NvcGUuY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gJ2Fycm93X2Ryb3BfZG93bidcblx0XHRcdH1cblx0XHRcdHJldHVybiAkc2NvcGUuY3VycmVudC5wZXJjZW50X2NoYW5nZSA+IDAgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXHRcdHZhciBnZXROYXRpb25CeU5hbWUgPSBmdW5jdGlvbiAobmFtZSkge1xuXHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5lcGksIGZ1bmN0aW9uIChuYXQpIHtcblx0XHRcdFx0aWYgKG5hdC5jb3VudHJ5ID09IG5hbWUpIHtcblx0XHRcdFx0XHRuYXRpb24gPSBuYXQ7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHR9O1xuXG5cdFx0dmFyIGNyZWF0ZUNhbnZhcyA9IGZ1bmN0aW9uIChjb2xvcnMpIHtcblx0XHRcdCRzY29wZS5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHRcdCRzY29wZS5jYW52YXMud2lkdGggPSAyNTY7XG5cdFx0XHQkc2NvcGUuY2FudmFzLmhlaWdodCA9IDEwO1xuXHRcdFx0JHNjb3BlLmN0eCA9ICRzY29wZS5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdHZhciBncmFkaWVudCA9ICRzY29wZS5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjU2LCAxMCk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdCRzY29wZS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHQkc2NvcGUuY3R4LmZpbGxSZWN0KDAsIDAsIDI1NiwgMTApO1xuXHRcdFx0JHNjb3BlLnBhbGV0dGUgPSAkc2NvcGUuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTYsIDEpLmRhdGE7XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKCRzY29wZS5jYW52YXMpO1xuXHRcdH1cblx0XHRjcmVhdGVDYW52YXMoKTtcblx0XHQkc2NvcGUuZHJhd0NvdW50cmllcyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0Y29uc29sZS5sb2coTWFwU2VydmljZS5nZXRMZWFmbGV0RGF0YSgpKTtcblx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG5cdFx0XHRcdC8vXHRMLnRpbGVMYXllcignaHR0cDovL2xvY2FsaG9zdDozMDAxL3NlcnZpY2VzL3Bvc3RnaXMvY291bnRyaWVzX2JpZy9nZW9tL2R5bmFtaWNNYXAve3p9L3t4fS97eX0ucG5nJykuYWRkVG8obWFwKTtcblx0XHRcdFx0dmFyIGRlYnVnID0ge307XG5cblx0XHRcdFx0dmFyIGFwaUtleSA9ICdway5leUoxSWpvaWJXRm5ibTlzYnlJc0ltRWlPaUp1U0ZkVVlrZzRJbjAuNUhPeWtLazBwTlAxTjNpc2ZQUUdUUSc7XG5cdFx0XHRcdHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAxL3NlcnZpY2VzL3Bvc3RnaXMvY291bnRyaWVzX2JpZy9nZW9tL3ZlY3Rvci10aWxlcy97en0ve3h9L3t5fS5wYmY/ZmllbGRzPWlkLGFkbWluLGFkbTBfYTMsbmFtZSxuYW1lX2xvbmcnOyAvL1xuXHRcdFx0XHR2YXIgdXJsMiA9ICdodHRwczovL2EudGlsZXMubWFwYm94LmNvbS92NC9tYXBib3gubWFwYm94LXN0cmVldHMtdjYtZGV2L3t6fS97eH0ve3l9LnZlY3Rvci5wYmY/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXk7XG5cdFx0XHRcdHZhciBtdnRTb3VyY2UgPSBuZXcgTC5UaWxlTGF5ZXIuTVZUU291cmNlKHtcblx0XHRcdFx0XHR1cmw6IHVybCwgLy9cImh0dHA6Ly9zcGF0aWFsc2VydmVyLnNwYXRpYWxkZXYuY29tL3NlcnZpY2VzL3ZlY3Rvci10aWxlcy9nYXVsX2ZzcF9pbmRpYS97en0ve3h9L3t5fS5wYmZcIixcblx0XHRcdFx0XHRkZWJ1ZzogZmFsc2UsXG5cdFx0XHRcdFx0Y2xpY2thYmxlTGF5ZXJzOiBbJ2NvdW50cmllc19iaWdfZ2VvbSddLFxuXHRcdFx0XHRcdG11dGV4VG9nZ2xlOiB0cnVlLFxuXHRcdFx0XHRcdG9uQ2xpY2s6IGZ1bmN0aW9uIChldnQsIHQpIHtcblx0XHRcdFx0XHRcdC8vbWFwLmZpdEJvdW5kcyhldnQudGFyZ2V0LmdldEJvdW5kcygpKTtcblx0XHRcdFx0XHRcdGlmKCRzY29wZS5jdXJyZW50LmNvdW50cnkgIT0gZXZ0LmZlYXR1cmUucHJvcGVydGllcy5hZG1pbil7XG5cdFx0XHRcdFx0XHRcdG1hcC5wYW5UbyhldnQubGF0bG5nKTtcblx0XHRcdFx0XHRcdFx0bWFwLnBhbkJ5KG5ldyBMLlBvaW50KC0yMDAsMCkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JHNjb3BlLmN1cnJlbnQgPSBnZXROYXRpb25CeU5hbWUoZXZ0LmZlYXR1cmUucHJvcGVydGllcy5hZG1pbik7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRnZXRJREZvckxheWVyRmVhdHVyZTogZnVuY3Rpb24gKGZlYXR1cmUpIHtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIGZlYXR1cmUucHJvcGVydGllcy5pZDtcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogVGhlIGZpbHRlciBmdW5jdGlvbiBnZXRzIGNhbGxlZCB3aGVuIGl0ZXJhdGluZyB0aG91Z2ggZWFjaCB2ZWN0b3IgdGlsZSBmZWF0dXJlICh2dGYpLiBZb3UgaGF2ZSBhY2Nlc3Ncblx0XHRcdFx0XHQgKiB0byBldmVyeSBwcm9wZXJ0eSBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBmZWF0dXJlICh0aGUgZmVhdHVyZSwgYW5kIHRoZSBsYXllcikuIFlvdSBjYW4gYWxzbyBmaWx0ZXJcblx0XHRcdFx0XHQgKiBiYXNlZCBvZiB0aGUgY29udGV4dCAoZWFjaCB0aWxlIHRoYXQgdGhlIGZlYXR1cmUgaXMgZHJhd24gb250bykuXG5cdFx0XHRcdFx0ICpcblx0XHRcdFx0XHQgKiBSZXR1cm5pbmcgZmFsc2Ugc2tpcHMgb3ZlciB0aGUgZmVhdHVyZSBhbmQgaXQgaXMgbm90IGRyYXduLlxuXHRcdFx0XHRcdCAqXG5cdFx0XHRcdFx0ICogQHBhcmFtIGZlYXR1cmVcblx0XHRcdFx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRmaWx0ZXI6IGZ1bmN0aW9uIChmZWF0dXJlLCBjb250ZXh0KSB7XG5cblx0XHRcdFx0XHRcdGlmIChmZWF0dXJlLmxheWVyLm5hbWUgPT09ICdhZG1pbicgfHwgZmVhdHVyZS5sYXllci5uYW1lID09PSAnZ2F1bF8yMDE0X2FkbTFfbGFiZWwnKSB7XG5cdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coZmVhdHVyZSk7XG5cdFx0XHRcdFx0XHRcdGlmIChmZWF0dXJlLnByb3BlcnRpZXMuYWRtaW5fbGV2ZWwgPT0gMCB8fCBmZWF0dXJlLnByb3BlcnRpZXMuYWRtaW5fbGV2ZWwgPT0gMSB8fCBmZWF0dXJlLnByb3BlcnRpZXMuYWRtaW5fbGV2ZWwgPT0gMikge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0c3R5bGU6IGZ1bmN0aW9uIChmZWF0dXJlKSB7XG5cdFx0XHRcdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdFx0XHRcdHZhciBuYXRpb24gPSBnZXROYXRpb25CeU5hbWUoZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbWluKTtcblx0XHRcdFx0XHRcdHZhciB0eXBlID0gZmVhdHVyZS50eXBlO1xuXHRcdFx0XHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDE6IC8vJ1BvaW50J1xuXHRcdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDQ5LDc5LDc5LDAuMDEpJztcblx0XHRcdFx0XHRcdFx0c3R5bGUucmFkaXVzID0gNTtcblx0XHRcdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMCwwLjUpJyxcblx0XHRcdFx0XHRcdFx0XHRyYWRpdXM6IDBcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDI6IC8vJ0xpbmVTdHJpbmcnXG5cdFx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDAsMCwxKSc7XG5cdFx0XHRcdFx0XHRcdHN0eWxlLnNpemUgPSAxO1xuXHRcdFx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1LDAsMSknLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdFx0XHRcdGlmIChuYXRpb24uc2NvcmUpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBuYXRpb24uc2NvcmUpICogNDtcblx0XHRcdFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgJHNjb3BlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArICRzY29wZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgJHNjb3BlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArICRzY29wZS5wYWxldHRlW2NvbG9yUG9zICszXSArICcpJztcblx0XHRcdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9IGNvbG9yO1xuXHRcdFx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNTAsNTAsNTAsMC40KScsXG5cdFx0XHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwLjApJyxcblx0XHRcdFx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDAuNSknLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuXHRcdFx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly9cdGlmIChmZWF0dXJlLmxheWVyLm5hbWUgPT09ICdnYXVsXzIwMTRfYWRtMV9sYWJlbCcpIHtcblx0XHRcdFx0XHRcdHN0eWxlLmFqYXhTb3VyY2UgPSBmdW5jdGlvbiAobXZ0RmVhdHVyZSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgaWQgPSBtdnRGZWF0dXJlLmlkO1xuXHRcdFx0XHRcdFx0XHQvL1x0Y29uc29sZS5sb2coaWQpO1xuXHRcdFx0XHRcdFx0XHQvL3JldHVybiAnaHR0cDovL3NwYXRpYWxzZXJ2ZXIuc3BhdGlhbGRldi5jb20vZnNwLzIwMTQvZnNwL2FnZ3JlZ2F0aW9ucy1uby1uYW1lLycgKyBpZCArICcuanNvbic7XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHRzdHlsZS5zdGF0aWNMYWJlbCA9IGZ1bmN0aW9uIChtdnRGZWF0dXJlLCBhamF4RGF0YSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgc3R5bGUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0aHRtbDogYWpheERhdGEudG90YWxfY291bnQsXG5cdFx0XHRcdFx0XHRcdFx0aWNvblNpemU6IFszMywgMzNdLFxuXHRcdFx0XHRcdFx0XHRcdGNzc0NsYXNzOiAnbGFiZWwtaWNvbi1udW1iZXInLFxuXHRcdFx0XHRcdFx0XHRcdGNzc1NlbGVjdGVkQ2xhc3M6ICdsYWJlbC1pY29uLW51bWJlci1zZWxlY3RlZCdcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdC8vXHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogV2hlbiB3ZSB3YW50IHRvIGxpbmsgZXZlbnRzIGJldHdlZW4gbGF5ZXJzLCBsaWtlIGNsaWNraW5nIG9uIGEgbGFiZWwgYW5kIGFcblx0XHRcdFx0XHQgKiBjb3JyZXNwb25kaW5nIHBvbHlnb24gZnJlYXR1cmUsIHRoaXMgd2lsbCByZXR1cm4gdGhlIGNvcnJlc3BvbmRpbmcgbWFwcGluZ1xuXHRcdFx0XHRcdCAqIGJldHdlZW4gbGF5ZXJzLiBUaGlzIHByb3ZpZGVzIGtub3dsZWRnZSBvZiB3aGljaCBvdGhlciBmZWF0dXJlIGEgZ2l2ZW4gZmVhdHVyZVxuXHRcdFx0XHRcdCAqIGlzIGxpbmtlZCB0by5cblx0XHRcdFx0XHQgKlxuXHRcdFx0XHRcdCAqIEBwYXJhbSBsYXllck5hbWUgIHRoZSBsYXllciB3ZSB3YW50IHRvIGtub3cgdGhlIGxpbmtlZCBsYXllciBmcm9tXG5cdFx0XHRcdFx0ICogQHJldHVybnMge3N0cmluZ30gcmV0dXJucyBjb3JyZXNwb25kaW5nIGxpbmtlZCBsYXllclxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGxheWVyTGluazogZnVuY3Rpb24gKGxheWVyTmFtZSkge1xuXHRcdFx0XHRcdFx0aWYgKGxheWVyTmFtZS5pbmRleE9mKCdfbGFiZWwnKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBsYXllck5hbWUucmVwbGFjZSgnX2xhYmVsJywgJycpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIGxheWVyTmFtZSArICdfbGFiZWwnO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9KTtcblx0XHRcdFx0ZGVidWcubXZ0U291cmNlID0gbXZ0U291cmNlO1xuXHRcdFx0XHRtYXAuYWRkTGF5ZXIobXZ0U291cmNlKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0dlbmVyYXRvcnNDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGVhZGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSl7XG5cblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJHJvb3RTY29wZS5jdXJyZW50X3BhZ2U7XG5cdFx0fSwgZnVuY3Rpb24obmV3UGFnZSl7XG5cdFx0XHQkc2NvcGUuY3VycmVudF9wYWdlID0gbmV3UGFnZSB8fCAnUGFnZSBOYW1lJztcblx0XHR9KTtcblxuXG5cdH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSnd0QXV0aEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRhdXRoLCBSZXN0YW5ndWxhcil7XG5cblx0XHR2YXIgY3JlZGVudGlhbHMgPSB7fTtcblxuXHRcdCRzY29wZS5yZXF1ZXN0VG9rZW4gPSBmdW5jdGlvbigpe1xuXHRcdFx0Ly8gVXNlIFNhdGVsbGl6ZXIncyAkYXV0aCBzZXJ2aWNlIHRvIGxvZ2luIGJlY2F1c2UgaXQnbGwgYXV0b21hdGljYWxseSBzYXZlIHRoZSBKV1QgaW4gbG9jYWxTdG9yYWdlXG5cdFx0XHQkYXV0aC5sb2dpbihjcmVkZW50aWFscykudGhlbihmdW5jdGlvbiAoZGF0YSl7XG5cdFx0XHRcdC8vIElmIGxvZ2luIGlzIHN1Y2Nlc3NmdWwsIHJlZGlyZWN0IHRvIHRoZSB1c2VycyBzdGF0ZVxuXHRcdFx0XHQvLyRzdGF0ZS5nbygnZGFzaGJvYXJkJyk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0Ly8gVGhpcyByZXF1ZXN0IHdpbGwgaGl0IHRoZSBnZXREYXRhIG1ldGhvZCBpbiB0aGUgQXV0aGVudGljYXRlQ29udHJvbGxlclxuXHRcdC8vIG9uIHRoZSBMYXJhdmVsIHNpZGUgYW5kIHdpbGwgcmV0dXJuIHlvdXIgZGF0YSB0aGF0IHJlcXVpcmUgYXV0aGVudGljYXRpb25cblx0XHQkc2NvcGUuZ2V0RGF0YSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRSZXN0YW5ndWxhci5hbGwoJ2F1dGhlbnRpY2F0ZS9kYXRhJykuZ2V0KCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuXG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyb3Ipe30pO1xuXHRcdH07XG5cblxuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMYW5kaW5nQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJG1kVG9hc3QsICRtZERpYWxvZywgJGludGVydmFsLCBUb2FzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2Upe1xuXG5cdFx0JHNjb3BlLnByb21vSW1hZ2UgPSAnaHR0cHM6Ly9pLmltZ3VyLmNvbS9aYkx6T1BQLmpwZyc7XG5cdFx0JHNjb3BlLmljb24gPSAnc2VuZCc7XG5cblx0XHR2YXIgaWNvbnMgPSBbXG5cdFx0XHRcdCdvZmZpY2UnLCAnZmFjZWJvb2snLCAndHdpdHRlcicsICdhcHBsZScsICd3aGF0c2FwcCcsICdsaW5rZWRpbicsICd3aW5kb3dzJywgJ2FjY2Vzc2liaWxpdHknLCAnYWxhcm0nLCAnYXNwZWN0X3JhdGlvJyxcblx0XHRcdFx0J2F1dG9yZW5ldycsICdib29rbWFya19vdXRsaW5lJywgJ2Rhc2hib2FyZCcsICdkbnMnLCAnZmF2b3JpdGVfb3V0bGluZScsICdnZXRfYXBwJywgJ2hpZ2hsaWdodF9yZW1vdmUnLCAnaGlzdG9yeScsICdsaXN0Jyxcblx0XHRcdFx0J3BpY3R1cmVfaW5fcGljdHVyZScsICdwcmludCcsICdzZXR0aW5nc19ldGhlcm5ldCcsICdzZXR0aW5nc19wb3dlcicsICdzaG9wcGluZ19jYXJ0JywgJ3NwZWxsY2hlY2snLCAnc3dhcF9ob3JpeicsICdzd2FwX3ZlcnQnLFxuXHRcdFx0XHQndGh1bWJfdXAnLCAndGh1bWJzX3VwX2Rvd24nLCAndHJhbnNsYXRlJywgJ3RyZW5kaW5nX3VwJywgJ3Zpc2liaWxpdHknLCAnd2FybmluZycsICdtaWMnLCAncGxheV9jaXJjbGVfb3V0bGluZScsICdyZXBlYXQnLFxuXHRcdFx0XHQnc2tpcF9uZXh0JywgJ2NhbGwnLCAnY2hhdCcsICdjbGVhcl9hbGwnLCAnZGlhbHBhZCcsICdkbmRfb24nLCAnZm9ydW0nLCAnbG9jYXRpb25fb24nLCAndnBuX2tleScsICdmaWx0ZXJfbGlzdCcsICdpbmJveCcsXG5cdFx0XHRcdCdsaW5rJywgJ3JlbW92ZV9jaXJjbGVfb3V0bGluZScsICdzYXZlJywgJ3RleHRfZm9ybWF0JywgJ2FjY2Vzc190aW1lJywgJ2FpcnBsYW5lbW9kZV9vbicsICdibHVldG9vdGgnLCAnZGF0YV91c2FnZScsXG5cdFx0XHRcdCdncHNfZml4ZWQnLCAnbm93X3dhbGxwYXBlcicsICdub3dfd2lkZ2V0cycsICdzdG9yYWdlJywgJ3dpZmlfdGV0aGVyaW5nJywgJ2F0dGFjaF9maWxlJywgJ2Zvcm1hdF9saW5lX3NwYWNpbmcnLFxuXHRcdFx0XHQnZm9ybWF0X2xpc3RfbnVtYmVyZWQnLCAnZm9ybWF0X3F1b3RlJywgJ3ZlcnRpY2FsX2FsaWduX2NlbnRlcicsICd3cmFwX3RleHQnLCAnY2xvdWRfcXVldWUnLCAnZmlsZV9kb3dubG9hZCcsICdmb2xkZXJfb3BlbicsXG5cdFx0XHRcdCdjYXN0JywgJ2hlYWRzZXQnLCAna2V5Ym9hcmRfYmFja3NwYWNlJywgJ21vdXNlJywgJ3NwZWFrZXInLCAnd2F0Y2gnLCAnYXVkaW90cmFjaycsICdlZGl0JywgJ2JydXNoJywgJ2xvb2tzJywgJ2Nyb3BfZnJlZScsXG5cdFx0XHRcdCdjYW1lcmEnLCAnZmlsdGVyX3ZpbnRhZ2UnLCAnaGRyX3N0cm9uZycsICdwaG90b19jYW1lcmEnLCAnc2xpZGVzaG93JywgJ3RpbWVyJywgJ2RpcmVjdGlvbnNfYmlrZScsICdob3RlbCcsICdsb2NhbF9saWJyYXJ5Jyxcblx0XHRcdFx0J2RpcmVjdGlvbnNfd2FsaycsICdsb2NhbF9jYWZlJywgJ2xvY2FsX3BpenphJywgJ2xvY2FsX2Zsb3Jpc3QnLCAnbXlfbG9jYXRpb24nLCAnbmF2aWdhdGlvbicsICdwaW5fZHJvcCcsICdhcnJvd19iYWNrJywgJ21lbnUnLFxuXHRcdFx0XHQnY2xvc2UnLCAnbW9yZV9ob3JpeicsICdtb3JlX3ZlcnQnLCAncmVmcmVzaCcsICdwaG9uZV9wYXVzZWQnLCAndmlicmF0aW9uJywgJ2Nha2UnLCAnZ3JvdXAnLCAnbW9vZCcsICdwZXJzb24nLFxuXHRcdFx0XHQnbm90aWZpY2F0aW9uc19ub25lJywgJ3BsdXNfb25lJywgJ3NjaG9vbCcsICdzaGFyZScsICdzdGFyX291dGxpbmUnXG5cdFx0XHRdLFxuXHRcdFx0Y291bnRlciA9IDA7XG5cblx0XHQkaW50ZXJ2YWwoZnVuY3Rpb24oKXtcblx0XHRcdCRzY29wZS5pY29uID0gaWNvbnNbKytjb3VudGVyXTtcblx0XHRcdGlmIChjb3VudGVyID4gMTEyKXtcblx0XHRcdFx0Y291bnRlciA9IDA7XG5cdFx0XHR9XG5cdFx0fSwgMjAwMCk7XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWFwQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUsICR0aW1lb3V0LCBNYXBTZXJ2aWNlLCBsZWFmbGV0RGF0YSwgJGh0dHApIHtcblx0XHQvL1xuXHRcdHZhciBhcGlLZXkgPSAncGsuZXlKMUlqb2liV0ZuYm05c2J5SXNJbUVpT2lKdVNGZFVZa2c0SW4wLjVIT3lrS2swcE5QMU4zaXNmUFFHVFEnO1xuXG5cdFx0Lyokc2NvcGUuZGVmYXVsdHMgPSB7XG5cdFx0XHR0aWxlTGF5ZXI6ICdodHRwczovL3tzfS50aWxlcy5tYXBib3guY29tL3Y0L21hcGJveC5wZW5jaWwve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj0nICsgYXBpS2V5LFxuXHRcdFx0bWF4Wm9vbTogMTQsXG5cdFx0XHRkZXRlY3RSZXRpbmE6IHRydWUsXG5cdFx0XHRhdHRyaWJ1dGlvbjogJydcblx0XHR9O1xuXHRcdCRzY29wZS5jZW50ZXIgPSB7XG5cdFx0XHRsYXQ6IDAsXG5cdFx0XHRsbmc6IDAsXG5cdFx0XHR6b29tOiAzXG5cdFx0fTsqL1xuXHRcdGFuZ3VsYXIuZXh0ZW5kKCRzY29wZSwge1xuXHRcdFx0Y2VudGVyOiB7XG5cdFx0XHRcdGxhdDogMCxcblx0XHRcdFx0bG5nOiAwLFxuXHRcdFx0XHR6b29tOiAzXG5cdFx0XHR9LFxuXHRcdFx0bGF5ZXJzOiB7XG5cdFx0XHRcdGJhc2VsYXllcnM6IHtcblx0XHRcdFx0XHR4eXo6IHtcblx0XHRcdFx0XHRcdG5hbWU6ICdNYXBCb3ggUGVuY2lsJyxcblx0XHRcdFx0XHRcdHVybDogJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvbWFwYm94LnBlbmNpbC97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXksXG5cdFx0XHRcdFx0XHR0eXBlOiAneHl6J1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0b3ZlcmxheXM6IHtcblx0XHRcdFx0XHRkZW1vc3V0ZmdyaWQ6IHtcblx0XHRcdFx0XHRcdG5hbWU6ICdVVEZHcmlkIEludGVyYWN0aXZpdHknLFxuXHRcdFx0XHRcdFx0dHlwZTogJ3V0ZkdyaWQnLFxuXHRcdFx0XHRcdFx0dXJsOiAnaHR0cDovL3tzfS50aWxlcy5tYXBib3guY29tL3YzL21hcGJveC5nZW9ncmFwaHktY2xhc3Mve3p9L3t4fS97eX0uZ3JpZC5qc29uP2NhbGxiYWNrPXtjYn0nLFxuXHRcdFx0XHRcdFx0dmlzaWJsZTogdHJ1ZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCRzY29wZS5zZWFyY2hJUCA9IGZ1bmN0aW9uIChpcCkge1xuXHRcdFx0dmFyIHVybCA9IFwiaHR0cDovL2ZyZWVnZW9pcC5uZXQvanNvbi9cIiArIGlwO1xuXHRcdFx0JGh0dHAuZ2V0KHVybCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdCRzY29wZS5jZW50ZXIgPSB7XG5cdFx0XHRcdFx0bGF0OiByZXMubGF0aXR1ZGUsXG5cdFx0XHRcdFx0bG5nOiByZXMubG9uZ2l0dWRlLFxuXHRcdFx0XHRcdHpvb206IDNcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuaXAgPSByZXMuaXA7XG5cdFx0XHR9KVxuXHRcdH07XG5cblx0XHQkc2NvcGUuc2VhcmNoSVAoXCJcIik7XG5cdFx0JHNjb3BlLmludGVyYWN0aXZpdHkgPSBcIlwiO1xuXHRcdCRzY29wZS5mbGFnID0gXCJcIjtcblx0XHQkc2NvcGUuJG9uKCdsZWFmbGV0RGlyZWN0aXZlTWFwLnV0ZmdyaWRNb3VzZW92ZXInLCBmdW5jdGlvbiAoZXZlbnQsIGxlYWZsZXRFdmVudCkge1xuXHRcdFx0Ly8gdGhlIFVURkdyaWQgaW5mb3JtYXRpb24gaXMgb24gbGVhZmxldEV2ZW50LmRhdGFcblx0XHRcdCRzY29wZS5pbnRlcmFjdGl2aXR5ID0gbGVhZmxldEV2ZW50LmRhdGEuYWRtaW47XG5cdFx0XHQkc2NvcGUuZmxhZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgbGVhZmxldEV2ZW50LmRhdGEuZmxhZ19wbmc7XG5cblx0XHR9KTtcblx0XHQkc2NvcGUuJG9uKCdsZWFmbGV0RGlyZWN0aXZlTWFwLnV0ZmdyaWRNb3VzZW91dCcsIGZ1bmN0aW9uIChldmVudCwgbGVhZmxldEV2ZW50KSB7XG5cdFx0XHQkc2NvcGUuaW50ZXJhY3Rpdml0eSA9IFwiXCI7XG5cdFx0XHQkc2NvcGUuZmxhZyA9IFwiXCI7XG5cdFx0fSk7XG5cdFx0TWFwU2VydmljZS5zZXRMZWFmbGV0RGF0YShsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpKTtcblxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24gKCl7XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01pc2NDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Jlc3RBcGlDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG5cblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Rhc2hib2FyZEN0cmwnLCBmdW5jdGlvbigpe1xuXG5cdH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVG9hc3RzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVG9hc3RTZXJ2aWNlKXtcblxuXHRcdCRzY29wZS50b2FzdFN1Y2Nlc3MgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLnNob3coJ1VzZXIgYWRkZWQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdH07XG5cblx0XHQkc2NvcGUudG9hc3RFcnJvciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoJ0Nvbm5lY3Rpb24gaW50ZXJydXB0ZWQhJyk7XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Vuc3VwcG9ydGVkQnJvd3NlckN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVXNlcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG5cdCAgICAgICAgLy9kbyBzb21ldGhpbmcgdXNlZnVsXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnRGF0YUxpc3RpbmdDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2RhdGFMaXN0aW5nJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvZGF0YV9saXN0aW5nL2RhdGFfbGlzdGluZy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdEYXRhTGlzdGluZ0N0cmwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQnViYmxlc0N0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnYnViYmxlcycsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZWZhdWx0cztcblx0XHRkZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHdpZHRoOiA5NDAsXG5cdFx0XHRcdGhlaWdodDogNjAwLFxuXHRcdFx0XHRsYXlvdXRfZ3Jhdml0eTotMC4wNixcblx0XHRcdFx0dmlzOiBudWxsLFxuXHRcdFx0XHRmb3JjZTogbnVsbCxcblx0XHRcdFx0ZGFtcGVyOiAwLjEsXG5cdFx0XHRcdGNpcmNsZXM6IG51bGwsXG5cdFx0XHRcdGZpbGxfY29sb3I6IGQzLnNjYWxlLm9yZGluYWwoKS5kb21haW4oW1wiZWhcIiwgXCJldlwiXSkucmFuZ2UoW1wiI2EzMTAzMVwiLCBcIiNiZWNjYWVcIl0pLFxuXHRcdFx0XHRtYXhfYW1vdW50OiAnJyxcblx0XHRcdFx0cmFkaXVzX3NjYWxlOiAnJyxcblx0XHRcdFx0Ly90b29sdGlwOiBDdXN0b21Ub29sdGlwKFwiZ2F0ZXNfdG9vbHRpcFwiLCAyNDApXG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRjb250cm9sbGVyOiAnQnViYmxlc0N0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0Y2hhcnRkYXRhOiAnPScsXG5cdFx0XHRcdGRpcmVjdGlvbjogJz0nLFxuXHRcdFx0XHRncmF2aXR5Oic9Jyxcblx0XHRcdFx0c2l6ZWZhY3RvcjogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtLCBhdHRycyApe1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksIGF0dHJzKTtcblx0XHRcdFx0dmFyIG5vZGVzID0gW107XG5cblx0XHRcdFx0dmFyIG1heF9hbW91bnQgPSBkMy5tYXgoc2NvcGUuY2hhcnRkYXRhLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBwYXJzZUludChkLnZhbHVlKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0b3B0aW9ucy5yYWRpdXNfc2NhbGUgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgwLjUpLmRvbWFpbihbMCwgbWF4X2Ftb3VudF0pLnJhbmdlKFsyLCA4NV0pO1xuXHRcdFx0XHRvcHRpb25zLmNlbnRlciA9IHtcblx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHR5OiBvcHRpb25zLmhlaWdodCAvIDJcblx0XHRcdFx0fTtcblx0XHRcdFx0b3B0aW9ucy5jYXRfY2VudGVycyA9IHtcbiAgICAgICAgXCJldlwiOiB7XG4gICAgICAgICAgeDogb3B0aW9ucy53aWR0aCAvIDIsXG4gICAgICAgICAgeTogb3B0aW9ucy5oZWlnaHQgLyAyICsgb3B0aW9ucy5oZWlnaHQgLyA0MCxcblx0XHRcdFx0XHRkYW1wZXI6IDAuMVxuICAgICAgICB9LFxuXG4gICAgICAgIFwiZWhcIjoge1xuICAgICAgICAgIHg6IG9wdGlvbnMud2lkdGggLyAyLFxuICAgICAgICAgIHk6IG9wdGlvbnMuaGVpZ2h0IC8gMiAtIG9wdGlvbnMuaGVpZ2h0IC8gNDAsXG5cdFx0XHRcdFx0ZGFtcGVyOiAwLjFcbiAgICAgICAgfVxuICAgICAgfTtcblx0XHRcdFx0dmFyIGNyZWF0ZV9ub2RlcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRub2RlcyA9IFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0aWQ6MSxcblx0XHRcdFx0XHRcdFx0cmFkaXVzOnNjb3BlLmNoYXJ0ZGF0YS5laF9oaSAvc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0dmFsdWU6c2NvcGUuY2hhcnRkYXRhLmVoX2hpL3Njb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdIZWFsdGggSW1wYWN0Jyxcblx0XHRcdFx0XHRcdFx0Z3JvdXA6ICdlaCcsXG5cdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnlcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGlkOjIsXG5cdFx0XHRcdFx0XHRcdHJhZGl1czpzY29wZS5jaGFydGRhdGEuZWhfYXEgL3Njb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdHZhbHVlOnNjb3BlLmNoYXJ0ZGF0YS5laF9hcSAvc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0bmFtZTogJ0FpciBRdWFsaXR5Jyxcblx0XHRcdFx0XHRcdFx0Z3JvdXA6ICdlaCcsXG5cdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnlcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGlkOjMsXG5cdFx0XHRcdFx0XHRcdHJhZGl1czpzY29wZS5jaGFydGRhdGEuZWhfd3Mvc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0dmFsdWU6c2NvcGUuY2hhcnRkYXRhLmVoX3dzL3Njb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdXYXRlciBTYW5pdGF0aW9uJyxcblx0XHRcdFx0XHRcdFx0Z3JvdXA6ICdlaCcsXG5cdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnlcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGlkOjQsXG5cdFx0XHRcdFx0XHRcdHJhZGl1czpzY29wZS5jaGFydGRhdGEuZXZfd3Ivc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0dmFsdWU6c2NvcGUuY2hhcnRkYXRhLmV2X3dyL3Njb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdXYXRlciBSZXNvdXJjZXMnLFxuXHRcdFx0XHRcdFx0XHRncm91cDogJ2V2Jyxcblx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0aWQ6NSxcblx0XHRcdFx0XHRcdFx0cmFkaXVzOnNjb3BlLmNoYXJ0ZGF0YS5ldl9hZy9zY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTpzY29wZS5jaGFydGRhdGEuZXZfYWcvc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0bmFtZTogJ0FncmljdWx0dXJlJyxcblx0XHRcdFx0XHRcdFx0Z3JvdXA6ICdldicsXG5cdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnlcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGlkOjYsXG5cdFx0XHRcdFx0XHRcdHJhZGl1czpzY29wZS5jaGFydGRhdGEuZXZfZm8vc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0dmFsdWU6c2NvcGUuY2hhcnRkYXRhLmV2X2ZvL3Njb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdGb3Jlc3QnLFxuXHRcdFx0XHRcdFx0XHRncm91cDogJ2V2Jyxcblx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0aWQ6Nyxcblx0XHRcdFx0XHRcdFx0cmFkaXVzOnNjb3BlLmNoYXJ0ZGF0YS5ldl9maS9zY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTpzY29wZS5jaGFydGRhdGEuZXZfZmkvc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0bmFtZTogJ0Zpc2hlcmllcycsXG5cdFx0XHRcdFx0XHRcdGdyb3VwOiAnZXYnLFxuXHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRpZDo4LFxuXHRcdFx0XHRcdFx0XHRyYWRpdXM6c2NvcGUuY2hhcnRkYXRhLmV2X2JkL3Njb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdHZhbHVlOnNjb3BlLmNoYXJ0ZGF0YS5ldl9iZC9zY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRuYW1lOiAnQmlvZGl2ZXJzaXR5IGFuZCBIYWJpdGF0Jyxcblx0XHRcdFx0XHRcdFx0Z3JvdXA6ICdldicsXG5cdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnlcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGlkOjksXG5cdFx0XHRcdFx0XHRcdHJhZGl1czpzY29wZS5jaGFydGRhdGEuZXZfY2Uvc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0dmFsdWU6c2NvcGUuY2hhcnRkYXRhLmV2X2NlL3Njb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdDbGltYXRlIGFuZCBFbmVyZ3knLFxuXHRcdFx0XHRcdFx0XHRncm91cDogJ2V2Jyxcblx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdF07XG5cdFx0XHRcdFx0LypzY29wZS5jaGFydGRhdGEuZm9yRWFjaCgoZnVuY3Rpb24gKF90aGlzKSB7XG5cblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbm9kZTtcblx0XHRcdFx0XHRcdFx0bm9kZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcblx0XHRcdFx0XHRcdFx0XHRyYWRpdXM6IGQudmFsdWUsXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IGQudmFsdWUsXG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogZC5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdG9yZzogJ2JsYScsXG5cdFx0XHRcdFx0XHRcdFx0Z3JvdXA6IGQuZ3JvdXAsXG5cdFx0XHRcdFx0XHRcdFx0Ly95ZWFyOiBkLnN0YXJ0X3llYXIsXG5cdFx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdHJldHVybiBub2Rlcy5wdXNoKG5vZGUpO1xuXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pKHRoaXMpKTtcblx0XHRcdFx0XHRyZXR1cm4gbm9kZXMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGIudmFsdWUgLSBhLnZhbHVlO1xuXHRcdFx0XHRcdH0pOyovXG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjcmVhdGVfdmlzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGFuZ3VsYXIuZWxlbWVudChlbGVtKS5odG1sKCcnKTtcblx0XHRcdFx0XHRvcHRpb25zLnZpcyA9IGQzLnNlbGVjdChlbGVtWzBdKS5hcHBlbmQoXCJzdmdcIikuYXR0cihcIndpZHRoXCIsIG9wdGlvbnMud2lkdGgpLmF0dHIoXCJoZWlnaHRcIiwgb3B0aW9ucy5oZWlnaHQpLmF0dHIoXCJpZFwiLCBcInN2Z192aXNcIik7XG5cdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzID0gb3B0aW9ucy52aXMuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmRhdGEobm9kZXMsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5pZDtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcy5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKS5hdHRyKFwiclwiLCAwKS5hdHRyKFwiZmlsbFwiLCAoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCk7XG5cdFx0XHRcdFx0fSkpLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMikuYXR0cihcInN0cm9rZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZDMucmdiKG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKSkuZGFya2VyKCk7XG5cblx0XHRcdFx0XHR9KS5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcImJ1YmJsZV9cIiArIGQuaWQ7XG5cdFx0XHRcdFx0fSkub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBzaG93X2RldGFpbHMoZCwgaSwgdGhpcyk7XG5cdFx0XHRcdFx0fSkub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGhpZGVfZGV0YWlscyhkLCBpLCB0aGlzKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5jaXJjbGVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbigyMDAwKS5hdHRyKFwiclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgdXBkYXRlX3ZpcyA9IGZ1bmN0aW9uKCl7XG5cblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNoYXJnZSA9IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIC1NYXRoLnBvdyhkLnJhZGl1cywgMi4wKSAvIDg7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBzdGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5mb3JjZSA9IGQzLmxheW91dC5mb3JjZSgpLm5vZGVzKG5vZGVzKS5zaXplKFtvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodF0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgZGlzcGxheV9ncm91cF9hbGwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5ncmF2aXR5KG9wdGlvbnMubGF5b3V0X2dyYXZpdHkpLmNoYXJnZShjaGFyZ2UpLmZyaWN0aW9uKDAuOSkub24oXCJ0aWNrXCIsIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5jaXJjbGVzLmVhY2gobW92ZV90b3dhcmRzX2NlbnRlcihlLmFscGhhKSkuYXR0cignY3gnLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdFx0XHRcdH0pLmF0dHIoXCJjeVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkLnk7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcykpO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0XHQvL3JldHVybiB0aGlzLmhpZGVfeWVhcnMoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfYnlfeWVhciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLmdyYXZpdHkob3B0aW9ucy5sYXlvdXRfZ3Jhdml0eSkuY2hhcmdlKGNoYXJnZSkuZnJpY3Rpb24oMC45KS5vbihcInRpY2tcIiwgKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBvcHRpb25zLmNpcmNsZXMuZWFjaChtb3ZlX3Rvd2FyZHNfY2F0KGUuYWxwaGEpKS5hdHRyKFwiY3hcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZC54O1xuXHRcdFx0XHRcdFx0XHR9KS5hdHRyKFwiY3lcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSkodGhpcykpO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0XHQvL3JldHVybiB0aGlzLmRpc3BsYXlfeWVhcnMoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc19jZW50ZXIgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArIChvcHRpb25zLmNlbnRlci54IC0gZC54KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGE7XG5cdFx0XHRcdFx0XHRcdGQueSA9IGQueSArIChvcHRpb25zLmNlbnRlci55IC0gZC55KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfdG9wID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAob3B0aW9ucy5jZW50ZXIueCAtIGQueCkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4xO1xuXHRcdFx0XHRcdFx0XHRkLnkgPSBkLnkgKyAoMjAwIC0gZC55KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfY2F0ID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgdGFyZ2V0O1xuICAgICAgICAgIHRhcmdldCA9IG9wdGlvbnMuY2F0X2NlbnRlcnNbZC5ncm91cF07XG5cbiAgICAgICAgICBkLnggPSBkLnggKyAodGFyZ2V0LnggLSBkLngpICogKHRhcmdldC5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4xO1xuICAgICAgICAgIHJldHVybiBkLnkgPSBkLnkgKyAodGFyZ2V0LnkgLSBkLnkpICogKHRhcmdldC5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4xO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHQvKnZhciBzaG93X2RldGFpbHMgPSBmdW5jdGlvbiAoZGF0YSwgaSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdHZhciBjb250ZW50O1xuXHRcdFx0XHRcdGQzLnNlbGVjdChlbGVtZW50KS5hdHRyKFwic3Ryb2tlXCIsIFwiYmxhY2tcIik7XG5cdFx0XHRcdFx0Y29udGVudCA9IFwiPHNwYW4gY2xhc3M9XFxcIm5hbWVcXFwiPlRpdGxlOjwvc3Bhbj48c3BhbiBjbGFzcz1cXFwidmFsdWVcXFwiPiBcIiArIGRhdGEubmFtZSArIFwiPC9zcGFuPjxici8+XCI7XG5cdFx0XHRcdFx0Y29udGVudCArPSBcIjxzcGFuIGNsYXNzPVxcXCJuYW1lXFxcIj5WYWx1ZTo8L3NwYW4+PHNwYW4gY2xhc3M9XFxcInZhbHVlXFxcIj4gXCIgKyAoYWRkQ29tbWFzKGRhdGEudmFsdWUpKSArIFwiPC9zcGFuPjxici8+XCI7XG5cdFx0XHRcdFx0Y29udGVudCArPSBcIjxzcGFuIGNsYXNzPVxcXCJuYW1lXFxcIj5ZZWFyOjwvc3Bhbj48c3BhbiBjbGFzcz1cXFwidmFsdWVcXFwiPiBcIiArIGRhdGEueWVhciArIFwiPC9zcGFuPlwiO1xuXHRcdFx0XHRcdHJldHVybiBvcHRpb25zLnRvb2x0aXAuc2hvd1Rvb2x0aXAoY29udGVudCwgZDMuZXZlbnQpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHZhciBoaWRlX2RldGFpbHMgPSBmdW5jdGlvbiAoZGF0YSwgaSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdGQzLnNlbGVjdChlbGVtZW50KS5hdHRyKFwic3Ryb2tlXCIsIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZDMucmdiKG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKSkuZGFya2VyKCk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pKHRoaXMpKTtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cdFx0XHRcdH07Ki9cblxuXG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnY2hhcnRkYXRhJywgZnVuY3Rpb24oZGF0YSwgb2xkRGF0YSl7XG5cdFx0XHRcdFx0aWYoZGF0YSA9PT0gb2xkRGF0YSB8fCAhZGF0YSl7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNyZWF0ZV9ub2RlcygpO1xuXHRcdFx0XHRcdGNyZWF0ZV92aXMoKTtcblx0XHRcdFx0XHRzdGFydCgpO1xuXHRcdFx0XHRcdGRpc3BsYXlfYnlfeWVhcigpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2RpcmVjdGlvbicsIGZ1bmN0aW9uKG9sZEQsIG5ld0Qpe1xuXHRcdFx0XHRcdGlmKG9sZEQgPT09IG5ld0Qpe1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihvbGREID09IFwiYWxsXCIpe1xuXHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdGRpc3BsYXlfYnlfeWVhcigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnZ3JhZGllbnQnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9ncmFkaWVudC9ncmFkaWVudC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdHcmFkaWVudEN0cmwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnR3JhZGllbnRDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9