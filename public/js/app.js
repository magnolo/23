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

(function (){
    "use strict";

    angular.module('app.controllers').controller('LoginCtrl', function (){

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

	angular.module( 'app.controllers' ).controller( 'BubblesCtrl', function(){
		//
    });

})();

(function() {
	"use strict";

	angular.module('app.directives').directive('bubbles', function() {
		var defaults;
		defaults = function() {
			return {
				width: 940,
				height: 600,
				layout_gravity: -0.06,
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
				gravity: '=',
				sizefactor: '='
			},
			link: function(scope, elem, attrs) {
				var options = angular.extend(defaults(), attrs);
				var nodes = [];

				var max_amount = d3.max(scope.chartdata, function(d) {
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
						y: options.height / 100 * 50,
						damper: 0.1
					},

					"eh": {
						x: options.width / 2,
						y: options.height / 100 * 45,
						damper: 0.1
					}
				};
				var create_nodes = function() {
					nodes = [{
						id: 1,
						type: 'eh_hi',
						radius: scope.chartdata.eh_hi / scope.sizefactor,
						value: scope.chartdata.eh_hi / scope.sizefactor,
						name: 'Health Impact',
						group: 'eh',
						x: options.center.x,
						y: options.center.y,
						color: '#a31031'
					}, {
						id: 2,
						type: 'eh_aq',
						radius: scope.chartdata.eh_aq / scope.sizefactor,
						value: scope.chartdata.eh_aq / scope.sizefactor,
						name: 'Air Quality',
						group: 'eh',
						x: options.center.x,
						y: options.center.y,
						color: 'rgb(0,255,0)'
					}, {
						id: 3,
						type: 'eh_ws',
						radius: scope.chartdata.eh_ws / scope.sizefactor,
						value: scope.chartdata.eh_ws / scope.sizefactor,
						name: 'Water Sanitation',
						group: 'eh',
						x: options.center.x,
						y: options.center.y
					}, {
						id: 4,
						type: 'ev_wr',
						radius: scope.chartdata.ev_wr / scope.sizefactor,
						value: scope.chartdata.ev_wr / scope.sizefactor,
						name: 'Water Resources',
						group: 'ev',
						x: options.center.x,
						y: options.center.y
					}, {
						id: 5,
						type: 'ev_ag',
						radius: scope.chartdata.ev_ag / scope.sizefactor,
						value: scope.chartdata.ev_ag / scope.sizefactor,
						name: 'Agriculture',
						group: 'ev',
						x: options.center.x,
						y: options.center.y
					}, {
						id: 6,
						type: 'ev_fo',
						radius: scope.chartdata.ev_fo / scope.sizefactor,
						value: scope.chartdata.ev_fo / scope.sizefactor,
						name: 'Forest',
						group: 'ev',
						x: options.center.x,
						y: options.center.y
					}, {
						id: 7,
						type: 'ev_fi',
						radius: scope.chartdata.ev_fi / scope.sizefactor,
						value: scope.chartdata.ev_fi / scope.sizefactor,
						name: 'Fisheries',
						group: 'ev',
						x: options.center.x,
						y: options.center.y
					}, {
						id: 8,
						type: 'ev_bd',
						radius: scope.chartdata.ev_bd / scope.sizefactor,
						value: scope.chartdata.ev_bd / scope.sizefactor,
						name: 'Biodiversity and Habitat',
						group: 'ev',
						x: options.center.x,
						y: options.center.y
					}, {
						id: 9,
						type: 'ev_ce',
						radius: scope.chartdata.ev_ce / scope.sizefactor,
						value: scope.chartdata.ev_ce / scope.sizefactor,
						name: 'Climate and Energy',
						group: 'ev',
						x: options.center.x,
						y: options.center.y
					}];
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
				var create_vis = function() {
					angular.element(elem).html('');
					options.vis = d3.select(elem[0]).append("svg").attr("width", options.width).attr("height", options.height).attr("id", "svg_vis");
					options.circles = options.vis.selectAll("circle").data(nodes, function(d) {
						return d.id;
					});
					var pi = Math.PI;
					var arcTop = d3.svg.arc()
						.innerRadius(108)
						.outerRadius(110)
						.startAngle(-90 * (pi / 180)) //converting from degs to radians
						.endAngle(90 * (pi / 180)); //just radians
					var arcBottom = d3.svg.arc()
						.innerRadius(123)
						.outerRadius(125)
						.startAngle(90 * (pi / 180)) //converting from degs to radians
						.endAngle(270 * (pi / 180)); //just radians
					options.arcTop = options.vis.append("path")
						.attr("d", arcTop)
						.attr("fill", "red")
						.attr("transform", "translate(170,140)");

					options.arcBottom = options.vis.append("path")
						.attr("d", arcBottom)
						.attr("fill", "red")
						.attr("transform", "translate(170,180)");
					options.circles.enter().append("circle").attr("r", 0).attr("fill", (function(d) {
						return d.color || options.fill_color(d.group);
					})).attr("stroke-width", 0).attr("stroke", function(d) {
						return d3.rgb(options.fill_color(d.group)).darker();

					}).attr("id", function(d) {
						return "bubble_" + d.id;
					}).on("mouseover", function(d, i) {
						return show_details(d, i, this);
					}).on("mouseout", function(d, i) {
						return hide_details(d, i, this);
					});
					return options.circles.transition().duration(2000).attr("r", function(d) {
						return d.radius;
					});
				};
				var update_vis = function() {
					console.log(typeof options.circles);
					var duration = 1000;
					nodes.forEach(function(d, i) {
						options.circles.transition().duration(duration).delay(i * duration)
							.attr("r", function(d) {
								return scope.chartdata[d.type] / scope.sizefactor;
							});
					});
				};
				var charge = function(d) {
					return -Math.pow(d.radius, 2.0) / 8;
				};
				var start = function() {
					return options.force = d3.layout.force().nodes(nodes).size([options.width, options.height]);
				};
				var display_group_all = function() {
					options.force.gravity(options.layout_gravity).charge(charge).friction(0.9).on("tick", function(e) {
						return options.circles.each(move_towards_center(e.alpha)).attr('cx', function(d) {
							return d.x;
						}).attr("cy", function(d) {
							return d.y;
						})
					});
					options.force.start();
					//return this.hide_years();
				};
				var display_by_year = function() {
					options.force.gravity(options.layout_gravity).charge(charge).friction(0.9).on("tick", (function(_this) {
						return function(e) {
							return options.circles.each(move_towards_cat(e.alpha)).attr("cx", function(d) {
								return d.x;
							}).attr("cy", function(d) {
								return d.y;
							});
						};
					})(this));
					options.force.start();
					//return this.display_years();
				};
				var move_towards_center = function(alpha) {
					return (function(_this) {
						return function(d) {
							d.x = d.x + (options.center.x - d.x) * (options.damper + 0.02) * alpha;
							d.y = d.y + (options.center.y - d.y) * (options.damper + 0.02) * alpha;
						}
					})(this);
				};
				var move_towards_top = function(alpha) {
					return (function(_this) {
						return function(d) {
							d.x = d.x + (options.center.x - d.x) * (options.damper + 0.02) * alpha * 1.1;
							d.y = d.y + (200 - d.y) * (options.damper + 0.02) * alpha * 1.1;
						}
					})(this);
				};
				var move_towards_cat = function(alpha) {
					return (function(_this) {
						return function(d) {
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


				scope.$watch('chartdata', function(data, oldData) {
					if (data === oldData || !data) {
						return;
					}

					if (options.circles == null) {
						create_nodes();
						create_vis();
						start();
					} else {
						update_vis();
						options.force.resume();
					}

					display_by_year();
				});

				scope.$watch('direction', function(oldD, newD) {
					if (oldD === newD) {
						return;
					}
					if (oldD == "all") {
						display_group_all();
					} else {
						display_by_year();
					}
				})
			}
		};
	});
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

(function(){
    "use strict";

    angular.module('app.controllers').controller('UnsupportedBrowserCtrl', function(){
        //
    });

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tYWluLmpzIiwiYXBwL3JvdXRlcy5qcyIsImFwcC9yb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvY2hhcnQuanMiLCJjb25maWcvbG9hZGluZ19iYXIuanMiLCJjb25maWcvcmVzdGFuZ3VsYXIuanMiLCJjb25maWcvdGhlbWUuanMiLCJmaWx0ZXJzL2NhcGl0YWxpemUuanMiLCJmaWx0ZXJzL2h1bWFuX3JlYWRhYmxlLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvTWFwLmpzIiwic2VydmljZXMvZGlhbG9nLmpzIiwic2VydmljZXMvdG9hc3QuanMiLCJhcHAvZGlhbG9ncy9kaWFsb2dzLmpzIiwiYXBwL2VsaXhpci9lbGl4aXIuanMiLCJhcHAvZXBpL2VwaS5qcyIsImFwcC9nZW5lcmF0b3JzL2dlbmVyYXRvcnMuanMiLCJhcHAvaGVhZGVyL2hlYWRlci5qcyIsImFwcC9qd3RfYXV0aC9qd3RfYXV0aC5qcyIsImFwcC9sYW5kaW5nL2xhbmRpbmcuanMiLCJhcHAvbWFwL21hcC5qcyIsImFwcC9taXNjL21pc2MuanMiLCJhcHAvcmVzdF9hcGkvcmVzdF9hcGkuanMiLCJhcHAvc2lkZWJhci9zaWRlYmFyLmpzIiwiYXBwL3RhYnMvdGFicy5qcyIsImFwcC90b2FzdHMvdG9hc3RzLmpzIiwiYXBwL2xvZ2luL2xvZ2luLmpzIiwiZGlhbG9ncy9hZGRfdXNlcnMvYWRkX3VzZXJzLmpzIiwiZGlyZWN0aXZlcy9idWJibGVzL2J1YmJsZXMuanMiLCJkaXJlY3RpdmVzL2J1YmJsZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvZGF0YV9saXN0aW5nL2RhdGFfbGlzdGluZy5qcyIsImRpcmVjdGl2ZXMvZGF0YV9saXN0aW5nL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2dyYWRpZW50L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2dyYWRpZW50L2dyYWRpZW50LmpzIiwiYXBwL3Vuc3VwcG9ydGVkX2Jyb3dzZXIvdW5zdXBwb3J0ZWRfYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxJQUFBLE1BQUEsUUFBQSxPQUFBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7Q0FJQSxRQUFBLE9BQUEsY0FBQSxDQUFBLGFBQUEsYUFBQTtDQUNBLFFBQUEsT0FBQSxtQkFBQSxDQUFBLGFBQUEsY0FBQSxhQUFBLGVBQUEsYUFBQSx1QkFBQSxjQUFBLG9CQUFBO0NBQ0EsUUFBQSxPQUFBLGVBQUE7Q0FDQSxRQUFBLE9BQUEsZ0JBQUEsQ0FBQSxhQUFBLGFBQUE7Q0FDQSxRQUFBLE9BQUEsa0JBQUE7Q0FDQSxRQUFBLE9BQUEsY0FBQTs7OztBQ25CQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxnREFBQSxTQUFBLGdCQUFBLG1CQUFBOztFQUVBLElBQUEsVUFBQSxTQUFBLFNBQUE7R0FDQSxPQUFBLGdCQUFBLFdBQUEsTUFBQSxXQUFBOzs7RUFHQSxtQkFBQSxVQUFBOztFQUVBO0lBQ0EsTUFBQSxPQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7Ozs7S0FJQSxRQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLE1BQUE7Ozs7SUFJQSxNQUFBLGVBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsV0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBLENBQUEsVUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLE9BQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLGVBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsWUFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBLENBQUEsVUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSxjQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUEsQ0FBQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLGFBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsY0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBLENBQUEsVUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSxlQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUEsQ0FBQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUEsQ0FBQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLGdCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUEsQ0FBQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLGNBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsZ0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsMkJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsWUFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBLENBQUEsVUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7Ozs7Ozs7O0FDdEpBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLG1CQUFBLFNBQUEsV0FBQTtFQUNBLFdBQUEsSUFBQSxxQkFBQSxTQUFBLE9BQUEsUUFBQTs7R0FFQSxJQUFBLFFBQUEsUUFBQSxRQUFBLEtBQUEsU0FBQTtJQUNBLFdBQUEsZUFBQSxRQUFBLEtBQUE7Ozs7O0VBS0EsV0FBQSxJQUFBLHNCQUFBLFNBQUEsT0FBQSxRQUFBO0dBQ0EsT0FBQSxNQUFBOzs7Ozs7QUNiQSxDQUFBLFdBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsY0FBQSx5QkFBQSxVQUFBLGNBQUE7OztRQUdBLGNBQUEsV0FBQTs7Ozs7QUNOQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSwyQkFBQSxVQUFBLGlCQUFBOztFQUVBLGdCQUFBLFdBQUE7R0FDQSxTQUFBLENBQUEsV0FBQTtHQUNBLFlBQUE7OztFQUdBLGdCQUFBLFdBQUEsUUFBQTtHQUNBLGFBQUE7Ozs7OztBQ1hBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLGlDQUFBLFVBQUEsc0JBQUE7RUFDQSxzQkFBQSxpQkFBQTs7Ozs7QUNKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxnQ0FBQSxTQUFBLHFCQUFBO0VBQ0E7R0FDQSxXQUFBOzs7OztBQ0xBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLDhCQUFBLFNBQUEsb0JBQUE7O0VBRUEsbUJBQUEsTUFBQTtHQUNBLGVBQUE7R0FDQSxjQUFBO0dBQ0EsWUFBQTs7Ozs7QUNSQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGNBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxPQUFBLEtBQUE7R0FDQSxPQUFBLENBQUEsQ0FBQSxDQUFBLFNBQUEsTUFBQSxRQUFBLHNCQUFBLFNBQUEsSUFBQTtJQUNBLE9BQUEsSUFBQSxPQUFBLEdBQUEsZ0JBQUEsSUFBQSxPQUFBLEdBQUE7UUFDQTs7Ozs7QUNQQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGlCQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsU0FBQSxLQUFBO0dBQ0EsS0FBQSxDQUFBLEtBQUE7SUFDQSxPQUFBOztHQUVBLElBQUEsUUFBQSxJQUFBLE1BQUE7R0FDQSxLQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxRQUFBLEtBQUE7SUFDQSxNQUFBLEtBQUEsTUFBQSxHQUFBLE9BQUEsR0FBQSxnQkFBQSxNQUFBLEdBQUEsTUFBQTs7R0FFQSxPQUFBLE1BQUEsS0FBQTs7OztBQ1pBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsc0JBQUEsVUFBQSxNQUFBO0VBQ0EsT0FBQSxVQUFBLE1BQUE7R0FDQSxPQUFBLEtBQUEsWUFBQTs7OztBQ0xBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsV0FBQSxXQUFBO0VBQ0EsT0FBQSxVQUFBLFFBQUE7R0FDQSxLQUFBLENBQUEsT0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQSxNQUFBLFVBQUEsR0FBQSxHQUFBLGdCQUFBLE1BQUEsVUFBQTs7Ozs7O0FDUkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsOEJBQUEsU0FBQSxZQUFBOztRQUVBLElBQUEsVUFBQTtRQUNBLE9BQUE7VUFDQSxnQkFBQSxTQUFBLEtBQUE7WUFDQSxVQUFBOztVQUVBLGdCQUFBLFVBQUE7WUFDQSxPQUFBOzs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsK0JBQUEsU0FBQSxVQUFBOztFQUVBLE9BQUE7R0FDQSxjQUFBLFNBQUEsVUFBQSxPQUFBOztJQUVBLElBQUEsVUFBQTtLQUNBLGFBQUEsb0JBQUEsV0FBQSxNQUFBLFdBQUE7OztJQUdBLElBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxPQUFBOzs7SUFHQSxPQUFBLFVBQUEsS0FBQTs7O0dBR0EsTUFBQSxVQUFBO0lBQ0EsT0FBQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsT0FBQSxRQUFBO0lBQ0EsVUFBQTtLQUNBLFVBQUE7T0FDQSxNQUFBO09BQ0EsUUFBQTtPQUNBLEdBQUE7Ozs7OztBQzVCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSw2QkFBQSxTQUFBLFNBQUE7O0VBRUEsSUFBQSxRQUFBO0dBQ0EsV0FBQTtHQUNBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLE1BQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxDQUFBLFFBQUE7S0FDQSxPQUFBOzs7SUFHQSxPQUFBLFNBQUE7S0FDQSxTQUFBO09BQ0EsUUFBQTtPQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7Ozs7OztBQ2xDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQ0FBQSxTQUFBLFFBQUEsY0FBQTtFQUNBLE9BQUEsY0FBQSxVQUFBO0dBQ0EsY0FBQSxNQUFBLDBCQUFBOzs7RUFHQSxPQUFBLGVBQUEsVUFBQTtHQUNBLGNBQUEsYUFBQSxhQUFBOzs7Ozs7QUNUQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxjQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGdGQUFBLFVBQUEsUUFBQSxZQUFBLGFBQUEsYUFBQSxZQUFBO0VBQ0EsT0FBQSxVQUFBO0VBQ0EsT0FBQSxTQUFBLENBQUEsV0FBQSxZQUFBLFNBQUEsU0FBQSxPQUFBLFFBQUE7RUFDQSxPQUFBLFNBQUEsQ0FBQSxZQUFBO0VBQ0EsT0FBQSxPQUFBO0dBQ0EsQ0FBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQTtHQUNBLENBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUE7O0VBRUEsSUFBQSxNQUFBLFlBQUEsSUFBQTtFQUNBLElBQUEsVUFBQSxLQUFBLFVBQUEsTUFBQTtHQUNBLE9BQUEsTUFBQTtHQUNBLE9BQUE7O0VBRUEsT0FBQSxhQUFBLFVBQUEsS0FBQTtHQUNBLE9BQUEsVUFBQTs7RUFFQSxPQUFBLFlBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxPQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsT0FBQSxRQUFBLE9BQUEsS0FBQTs7RUFFQSxPQUFBLGNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxPQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsT0FBQSxRQUFBLGlCQUFBLElBQUEsa0JBQUE7O0VBRUEsSUFBQSxrQkFBQSxVQUFBLE1BQUE7R0FDQSxJQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtJQUNBLElBQUEsSUFBQSxXQUFBLE1BQUE7S0FDQSxTQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxJQUFBLGVBQUEsVUFBQSxRQUFBO0dBQ0EsT0FBQSxTQUFBLFNBQUEsY0FBQTtHQUNBLE9BQUEsT0FBQSxRQUFBO0dBQ0EsT0FBQSxPQUFBLFNBQUE7R0FDQSxPQUFBLE1BQUEsT0FBQSxPQUFBLFdBQUE7R0FDQSxJQUFBLFdBQUEsT0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxTQUFBLGFBQUEsTUFBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsT0FBQSxJQUFBLFlBQUE7R0FDQSxPQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLE9BQUEsVUFBQSxPQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBO0dBQ0EsU0FBQSxxQkFBQSxRQUFBLEdBQUEsWUFBQSxPQUFBOztFQUVBO0VBQ0EsT0FBQSxnQkFBQSxZQUFBOztHQUVBLFFBQUEsSUFBQSxXQUFBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7O0lBRUEsSUFBQSxRQUFBOztJQUVBLElBQUEsU0FBQTtJQUNBLElBQUEsTUFBQTtJQUNBLElBQUEsT0FBQSxvR0FBQTtJQUNBLElBQUEsWUFBQSxJQUFBLEVBQUEsVUFBQSxVQUFBO0tBQ0EsS0FBQTtLQUNBLE9BQUE7S0FDQSxpQkFBQSxDQUFBO0tBQ0EsYUFBQTtLQUNBLFNBQUEsVUFBQSxLQUFBLEdBQUE7O01BRUEsR0FBQSxPQUFBLFFBQUEsV0FBQSxJQUFBLFFBQUEsV0FBQSxNQUFBO09BQ0EsSUFBQSxNQUFBLElBQUE7T0FDQSxJQUFBLE1BQUEsSUFBQSxFQUFBLE1BQUEsQ0FBQSxJQUFBOztNQUVBLE9BQUEsVUFBQSxnQkFBQSxJQUFBLFFBQUEsV0FBQTs7S0FFQSxzQkFBQSxVQUFBLFNBQUE7O01BRUEsT0FBQSxRQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7S0FhQSxRQUFBLFVBQUEsU0FBQSxTQUFBOztNQUVBLElBQUEsUUFBQSxNQUFBLFNBQUEsV0FBQSxRQUFBLE1BQUEsU0FBQSx3QkFBQTs7T0FFQSxJQUFBLFFBQUEsV0FBQSxlQUFBLEtBQUEsUUFBQSxXQUFBLGVBQUEsS0FBQSxRQUFBLFdBQUEsZUFBQSxHQUFBO1FBQ0EsT0FBQTtjQUNBO1FBQ0EsT0FBQTs7OztNQUlBLE9BQUE7OztLQUdBLE9BQUEsVUFBQSxTQUFBO01BQ0EsSUFBQSxRQUFBO01BQ0EsSUFBQSxTQUFBLGdCQUFBLFFBQUEsV0FBQTtNQUNBLElBQUEsT0FBQSxRQUFBO01BQ0EsUUFBQTtNQUNBLEtBQUE7T0FDQSxNQUFBLFFBQUE7T0FDQSxNQUFBLFNBQUE7T0FDQSxNQUFBLFdBQUE7UUFDQSxPQUFBO1FBQ0EsUUFBQTs7T0FFQTtNQUNBLEtBQUE7T0FDQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE9BQUE7T0FDQSxNQUFBLFdBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7T0FFQTtNQUNBLEtBQUE7T0FDQSxJQUFBLE9BQUEsT0FBQTtRQUNBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxPQUFBLFNBQUE7UUFDQSxJQUFBLFFBQUEsVUFBQSxPQUFBLFFBQUEsWUFBQSxPQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxPQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsT0FBQSxRQUFBLFVBQUEsS0FBQTtRQUNBLE1BQUEsUUFBQTtRQUNBLE1BQUEsVUFBQTtTQUNBLE9BQUE7U0FDQSxNQUFBOztRQUVBLE1BQUEsV0FBQTtTQUNBLE9BQUE7U0FDQSxTQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7OztRQUdBOztXQUVBO1FBQ0EsTUFBQSxRQUFBO1FBQ0EsTUFBQSxVQUFBO1NBQ0EsT0FBQTtTQUNBLE1BQUE7Ozs7OztNQU1BLE1BQUEsYUFBQSxVQUFBLFlBQUE7T0FDQSxJQUFBLEtBQUEsV0FBQTs7Ozs7TUFLQSxNQUFBLGNBQUEsVUFBQSxZQUFBLFVBQUE7T0FDQSxJQUFBLFFBQUE7UUFDQSxNQUFBLFNBQUE7UUFDQSxVQUFBLENBQUEsSUFBQTtRQUNBLFVBQUE7UUFDQSxrQkFBQTs7T0FFQSxPQUFBOzs7O01BSUEsT0FBQTs7Ozs7Ozs7Ozs7O0tBWUEsV0FBQSxVQUFBLFdBQUE7TUFDQSxJQUFBLFVBQUEsUUFBQSxZQUFBLENBQUEsR0FBQTtPQUNBLE9BQUEsVUFBQSxRQUFBLFVBQUE7O01BRUEsT0FBQSxZQUFBOzs7O0lBSUEsTUFBQSxZQUFBO0lBQ0EsSUFBQSxTQUFBOzs7Ozs7QUNuTUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsa0JBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUNBQUEsU0FBQSxRQUFBLFdBQUE7O0VBRUEsT0FBQSxPQUFBLFVBQUE7R0FDQSxPQUFBLFdBQUE7S0FDQSxTQUFBLFFBQUE7R0FDQSxPQUFBLGVBQUEsV0FBQTs7Ozs7Ozs7QUNSQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrREFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBOztFQUVBLElBQUEsY0FBQTs7RUFFQSxPQUFBLGVBQUEsVUFBQTs7R0FFQSxNQUFBLE1BQUEsYUFBQSxLQUFBLFVBQUEsS0FBQTs7Ozs7Ozs7RUFRQSxPQUFBLFVBQUEsVUFBQTtHQUNBLFlBQUEsSUFBQSxxQkFBQSxNQUFBLEtBQUEsVUFBQSxTQUFBOztNQUVBLFVBQUEsTUFBQTs7Ozs7Ozs7O0FDcEJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlHQUFBLFNBQUEsUUFBQSxVQUFBLFdBQUEsV0FBQSxjQUFBLGNBQUE7O0VBRUEsT0FBQSxhQUFBO0VBQ0EsT0FBQSxPQUFBOztFQUVBLElBQUEsUUFBQTtJQUNBLFVBQUEsWUFBQSxXQUFBLFNBQUEsWUFBQSxZQUFBLFdBQUEsaUJBQUEsU0FBQTtJQUNBLGFBQUEsb0JBQUEsYUFBQSxPQUFBLG9CQUFBLFdBQUEsb0JBQUEsV0FBQTtJQUNBLHNCQUFBLFNBQUEscUJBQUEsa0JBQUEsaUJBQUEsY0FBQSxjQUFBO0lBQ0EsWUFBQSxrQkFBQSxhQUFBLGVBQUEsY0FBQSxXQUFBLE9BQUEsdUJBQUE7SUFDQSxhQUFBLFFBQUEsUUFBQSxhQUFBLFdBQUEsVUFBQSxTQUFBLGVBQUEsV0FBQSxlQUFBO0lBQ0EsUUFBQSx5QkFBQSxRQUFBLGVBQUEsZUFBQSxtQkFBQSxhQUFBO0lBQ0EsYUFBQSxpQkFBQSxlQUFBLFdBQUEsa0JBQUEsZUFBQTtJQUNBLHdCQUFBLGdCQUFBLHlCQUFBLGFBQUEsZUFBQSxpQkFBQTtJQUNBLFFBQUEsV0FBQSxzQkFBQSxTQUFBLFdBQUEsU0FBQSxjQUFBLFFBQUEsU0FBQSxTQUFBO0lBQ0EsVUFBQSxrQkFBQSxjQUFBLGdCQUFBLGFBQUEsU0FBQSxtQkFBQSxTQUFBO0lBQ0EsbUJBQUEsY0FBQSxlQUFBLGlCQUFBLGVBQUEsY0FBQSxZQUFBLGNBQUE7SUFDQSxTQUFBLGNBQUEsYUFBQSxXQUFBLGdCQUFBLGFBQUEsUUFBQSxTQUFBLFFBQUE7SUFDQSxzQkFBQSxZQUFBLFVBQUEsU0FBQTs7R0FFQSxVQUFBOztFQUVBLFVBQUEsVUFBQTtHQUNBLE9BQUEsT0FBQSxNQUFBLEVBQUE7R0FDQSxJQUFBLFVBQUEsSUFBQTtJQUNBLFVBQUE7O0tBRUE7Ozs7OztBQzlCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxzRkFBQSxVQUFBLFFBQUEsWUFBQSxVQUFBLFlBQUEsYUFBQSxPQUFBOztFQUVBLElBQUEsU0FBQTs7Ozs7Ozs7Ozs7OztFQWFBLFFBQUEsT0FBQSxRQUFBO0dBQ0EsUUFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTs7R0FFQSxRQUFBO0lBQ0EsWUFBQTtLQUNBLEtBQUE7TUFDQSxNQUFBO01BQ0EsS0FBQSxnRkFBQTtNQUNBLE1BQUE7OztJQUdBLFVBQUE7S0FDQSxjQUFBO01BQ0EsTUFBQTtNQUNBLE1BQUE7TUFDQSxLQUFBO01BQ0EsU0FBQTs7Ozs7RUFLQSxPQUFBLFdBQUEsVUFBQSxJQUFBO0dBQ0EsSUFBQSxNQUFBLCtCQUFBO0dBQ0EsTUFBQSxJQUFBLEtBQUEsUUFBQSxVQUFBLEtBQUE7SUFDQSxPQUFBLFNBQUE7S0FDQSxLQUFBLElBQUE7S0FDQSxLQUFBLElBQUE7S0FDQSxNQUFBOztJQUVBLE9BQUEsS0FBQSxJQUFBOzs7O0VBSUEsT0FBQSxTQUFBO0VBQ0EsT0FBQSxnQkFBQTtFQUNBLE9BQUEsT0FBQTtFQUNBLE9BQUEsSUFBQSx3Q0FBQSxVQUFBLE9BQUEsY0FBQTs7R0FFQSxPQUFBLGdCQUFBLGFBQUEsS0FBQTtHQUNBLE9BQUEsT0FBQSwyQkFBQSxhQUFBLEtBQUE7OztFQUdBLE9BQUEsSUFBQSx1Q0FBQSxVQUFBLE9BQUEsY0FBQTtHQUNBLE9BQUEsZ0JBQUE7R0FDQSxPQUFBLE9BQUE7O0VBRUEsV0FBQSxlQUFBLFlBQUEsT0FBQTs7Ozs7QUNuRUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsWUFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxlQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9DQUFBLFNBQUEsUUFBQSxPQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxpQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5Q0FBQSxTQUFBLFFBQUEsYUFBQTs7RUFFQSxPQUFBLGVBQUEsVUFBQTtHQUNBLGFBQUEsS0FBQTs7O0VBR0EsT0FBQSxhQUFBLFVBQUE7R0FDQSxhQUFBLE1BQUE7Ozs7Ozs7QUNWQSxDQUFBLFdBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxhQUFBLFdBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRDQUFBLFNBQUEsUUFBQSxjQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBOztZQUVBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ1hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGVBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsV0FBQSxXQUFBO0VBQ0EsSUFBQTtFQUNBLFdBQUEsV0FBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLGdCQUFBLENBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxTQUFBO0lBQ0EsWUFBQSxHQUFBLE1BQUEsVUFBQSxPQUFBLENBQUEsTUFBQSxPQUFBLE1BQUEsQ0FBQSxXQUFBO0lBQ0EsWUFBQTtJQUNBLGNBQUE7Ozs7RUFJQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsV0FBQTtJQUNBLFdBQUE7SUFDQSxTQUFBO0lBQ0EsWUFBQTs7R0FFQSxNQUFBLFNBQUEsT0FBQSxNQUFBLE9BQUE7SUFDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxJQUFBLFFBQUE7O0lBRUEsSUFBQSxhQUFBLEdBQUEsSUFBQSxNQUFBLFdBQUEsU0FBQSxHQUFBO0tBQ0EsT0FBQSxTQUFBLEVBQUE7OztJQUdBLFFBQUEsZUFBQSxHQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsYUFBQSxNQUFBLENBQUEsR0FBQTtJQUNBLFFBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxRQUFBO0tBQ0EsR0FBQSxRQUFBLFNBQUE7O0lBRUEsUUFBQSxjQUFBO0tBQ0EsTUFBQTtNQUNBLEdBQUEsUUFBQSxRQUFBO01BQ0EsR0FBQSxRQUFBLFNBQUEsTUFBQTtNQUNBLFFBQUE7OztLQUdBLE1BQUE7TUFDQSxHQUFBLFFBQUEsUUFBQTtNQUNBLEdBQUEsUUFBQSxTQUFBLE1BQUE7TUFDQSxRQUFBOzs7SUFHQSxJQUFBLGVBQUEsV0FBQTtLQUNBLFFBQUEsQ0FBQTtNQUNBLElBQUE7TUFDQSxNQUFBO01BQ0EsUUFBQSxNQUFBLFVBQUEsUUFBQSxNQUFBO01BQ0EsT0FBQSxNQUFBLFVBQUEsUUFBQSxNQUFBO01BQ0EsTUFBQTtNQUNBLE9BQUE7TUFDQSxHQUFBLFFBQUEsT0FBQTtNQUNBLEdBQUEsUUFBQSxPQUFBO01BQ0EsT0FBQTtRQUNBO01BQ0EsSUFBQTtNQUNBLE1BQUE7TUFDQSxRQUFBLE1BQUEsVUFBQSxRQUFBLE1BQUE7TUFDQSxPQUFBLE1BQUEsVUFBQSxRQUFBLE1BQUE7TUFDQSxNQUFBO01BQ0EsT0FBQTtNQUNBLEdBQUEsUUFBQSxPQUFBO01BQ0EsR0FBQSxRQUFBLE9BQUE7TUFDQSxPQUFBO1FBQ0E7TUFDQSxJQUFBO01BQ0EsTUFBQTtNQUNBLFFBQUEsTUFBQSxVQUFBLFFBQUEsTUFBQTtNQUNBLE9BQUEsTUFBQSxVQUFBLFFBQUEsTUFBQTtNQUNBLE1BQUE7TUFDQSxPQUFBO01BQ0EsR0FBQSxRQUFBLE9BQUE7TUFDQSxHQUFBLFFBQUEsT0FBQTtRQUNBO01BQ0EsSUFBQTtNQUNBLE1BQUE7TUFDQSxRQUFBLE1BQUEsVUFBQSxRQUFBLE1BQUE7TUFDQSxPQUFBLE1BQUEsVUFBQSxRQUFBLE1BQUE7TUFDQSxNQUFBO01BQ0EsT0FBQTtNQUNBLEdBQUEsUUFBQSxPQUFBO01BQ0EsR0FBQSxRQUFBLE9BQUE7UUFDQTtNQUNBLElBQUE7TUFDQSxNQUFBO01BQ0EsUUFBQSxNQUFBLFVBQUEsUUFBQSxNQUFBO01BQ0EsT0FBQSxNQUFBLFVBQUEsUUFBQSxNQUFBO01BQ0EsTUFBQTtNQUNBLE9BQUE7TUFDQSxHQUFBLFFBQUEsT0FBQTtNQUNBLEdBQUEsUUFBQSxPQUFBO1FBQ0E7TUFDQSxJQUFBO01BQ0EsTUFBQTtNQUNBLFFBQUEsTUFBQSxVQUFBLFFBQUEsTUFBQTtNQUNBLE9BQUEsTUFBQSxVQUFBLFFBQUEsTUFBQTtNQUNBLE1BQUE7TUFDQSxPQUFBO01BQ0EsR0FBQSxRQUFBLE9BQUE7TUFDQSxHQUFBLFFBQUEsT0FBQTtRQUNBO01BQ0EsSUFBQTtNQUNBLE1BQUE7TUFDQSxRQUFBLE1BQUEsVUFBQSxRQUFBLE1BQUE7TUFDQSxPQUFBLE1BQUEsVUFBQSxRQUFBLE1BQUE7TUFDQSxNQUFBO01BQ0EsT0FBQTtNQUNBLEdBQUEsUUFBQSxPQUFBO01BQ0EsR0FBQSxRQUFBLE9BQUE7UUFDQTtNQUNBLElBQUE7TUFDQSxNQUFBO01BQ0EsUUFBQSxNQUFBLFVBQUEsUUFBQSxNQUFBO01BQ0EsT0FBQSxNQUFBLFVBQUEsUUFBQSxNQUFBO01BQ0EsTUFBQTtNQUNBLE9BQUE7TUFDQSxHQUFBLFFBQUEsT0FBQTtNQUNBLEdBQUEsUUFBQSxPQUFBO1FBQ0E7TUFDQSxJQUFBO01BQ0EsTUFBQTtNQUNBLFFBQUEsTUFBQSxVQUFBLFFBQUEsTUFBQTtNQUNBLE9BQUEsTUFBQSxVQUFBLFFBQUEsTUFBQTtNQUNBLE1BQUE7TUFDQSxPQUFBO01BQ0EsR0FBQSxRQUFBLE9BQUE7TUFDQSxHQUFBLFFBQUEsT0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXlCQSxJQUFBLGFBQUEsV0FBQTtLQUNBLFFBQUEsUUFBQSxNQUFBLEtBQUE7S0FDQSxRQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLFFBQUEsT0FBQSxLQUFBLFVBQUEsUUFBQSxRQUFBLEtBQUEsTUFBQTtLQUNBLFFBQUEsVUFBQSxRQUFBLElBQUEsVUFBQSxVQUFBLEtBQUEsT0FBQSxTQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7O0tBRUEsSUFBQSxLQUFBLEtBQUE7S0FDQSxJQUFBLFNBQUEsR0FBQSxJQUFBO09BQ0EsWUFBQTtPQUNBLFlBQUE7T0FDQSxXQUFBLENBQUEsTUFBQSxLQUFBO09BQ0EsU0FBQSxNQUFBLEtBQUE7S0FDQSxJQUFBLFlBQUEsR0FBQSxJQUFBO09BQ0EsWUFBQTtPQUNBLFlBQUE7T0FDQSxXQUFBLE1BQUEsS0FBQTtPQUNBLFNBQUEsT0FBQSxLQUFBO0tBQ0EsUUFBQSxTQUFBLFFBQUEsSUFBQSxPQUFBO09BQ0EsS0FBQSxLQUFBO09BQ0EsS0FBQSxRQUFBO09BQ0EsS0FBQSxhQUFBOztLQUVBLFFBQUEsWUFBQSxRQUFBLElBQUEsT0FBQTtPQUNBLEtBQUEsS0FBQTtPQUNBLEtBQUEsUUFBQTtPQUNBLEtBQUEsYUFBQTtLQUNBLFFBQUEsUUFBQSxRQUFBLE9BQUEsVUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUEsU0FBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsUUFBQSxXQUFBLEVBQUE7U0FDQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxVQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUEsR0FBQSxJQUFBLFFBQUEsV0FBQSxFQUFBLFFBQUE7O1FBRUEsS0FBQSxNQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUEsWUFBQSxFQUFBO1FBQ0EsR0FBQSxhQUFBLFNBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsWUFBQSxTQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsYUFBQSxHQUFBLEdBQUE7O0tBRUEsT0FBQSxRQUFBLFFBQUEsYUFBQSxTQUFBLE1BQUEsS0FBQSxLQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQTs7O0lBR0EsSUFBQSxhQUFBLFdBQUE7S0FDQSxRQUFBLElBQUEsT0FBQSxRQUFBO0tBQ0EsSUFBQSxXQUFBO0tBQ0EsTUFBQSxRQUFBLFNBQUEsR0FBQSxHQUFBO01BQ0EsUUFBQSxRQUFBLGFBQUEsU0FBQSxVQUFBLE1BQUEsSUFBQTtRQUNBLEtBQUEsS0FBQSxTQUFBLEdBQUE7UUFDQSxPQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTs7OztJQUlBLElBQUEsU0FBQSxTQUFBLEdBQUE7S0FDQSxPQUFBLENBQUEsS0FBQSxJQUFBLEVBQUEsUUFBQSxPQUFBOztJQUVBLElBQUEsUUFBQSxXQUFBO0tBQ0EsT0FBQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFFBQUEsTUFBQSxPQUFBLEtBQUEsQ0FBQSxRQUFBLE9BQUEsUUFBQTs7SUFFQSxJQUFBLG9CQUFBLFdBQUE7S0FDQSxRQUFBLE1BQUEsUUFBQSxRQUFBLGdCQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUEsUUFBQSxRQUFBLEtBQUEsb0JBQUEsRUFBQSxRQUFBLEtBQUEsTUFBQSxTQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7U0FDQSxLQUFBLE1BQUEsU0FBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOzs7S0FHQSxRQUFBLE1BQUE7OztJQUdBLElBQUEsa0JBQUEsV0FBQTtLQUNBLFFBQUEsTUFBQSxRQUFBLFFBQUEsZ0JBQUEsT0FBQSxRQUFBLFNBQUEsS0FBQSxHQUFBLFFBQUEsQ0FBQSxTQUFBLE9BQUE7TUFDQSxPQUFBLFNBQUEsR0FBQTtPQUNBLE9BQUEsUUFBQSxRQUFBLEtBQUEsaUJBQUEsRUFBQSxRQUFBLEtBQUEsTUFBQSxTQUFBLEdBQUE7UUFDQSxPQUFBLEVBQUE7VUFDQSxLQUFBLE1BQUEsU0FBQSxHQUFBO1FBQ0EsT0FBQSxFQUFBOzs7UUFHQTtLQUNBLFFBQUEsTUFBQTs7O0lBR0EsSUFBQSxzQkFBQSxTQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsU0FBQSxPQUFBO01BQ0EsT0FBQSxTQUFBLEdBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsUUFBQSxPQUFBLElBQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLG1CQUFBLFNBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxTQUFBLE9BQUE7TUFDQSxPQUFBLFNBQUEsR0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsbUJBQUEsU0FBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFNBQUEsT0FBQTtNQUNBLE9BQUEsU0FBQSxHQUFBO09BQ0EsSUFBQTtPQUNBLFNBQUEsUUFBQSxZQUFBLEVBQUE7O09BRUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTtPQUNBLE9BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUJBLE1BQUEsT0FBQSxhQUFBLFNBQUEsTUFBQSxTQUFBO0tBQ0EsSUFBQSxTQUFBLFdBQUEsQ0FBQSxNQUFBO01BQ0E7OztLQUdBLElBQUEsUUFBQSxXQUFBLE1BQUE7TUFDQTtNQUNBO01BQ0E7WUFDQTtNQUNBO01BQ0EsUUFBQSxNQUFBOzs7S0FHQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsU0FBQSxNQUFBLE1BQUE7S0FDQSxJQUFBLFNBQUEsTUFBQTtNQUNBOztLQUVBLElBQUEsUUFBQSxPQUFBO01BQ0E7WUFDQTtNQUNBOzs7Ozs7O0FDM1RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLGVBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBOzs7Ozs7Ozs7QUNUQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxZQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTs7Ozs7Ozs7O0FDVEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZ0JBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEJBQUEsVUFBQTs7Ozs7QUFLQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLFxuXHRcdFtcblx0XHQnYXBwLmNvbnRyb2xsZXJzJyxcblx0XHQnYXBwLmZpbHRlcnMnLFxuXHRcdCdhcHAuc2VydmljZXMnLFxuXHRcdCdhcHAuZGlyZWN0aXZlcycsXG5cdFx0J2FwcC5yb3V0ZXMnLFxuXHRcdCdhcHAuY29uZmlnJyxcblx0XHRdKTtcblxuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJywgWyd1aS5yb3V0ZXInLCAnbmdTdG9yYWdlJywgJ3NhdGVsbGl6ZXInXSk7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbJ3VpLnJvdXRlcicsICduZ01hdGVyaWFsJywgJ25nU3RvcmFnZScsICdyZXN0YW5ndWxhcicsICduZ01kSWNvbnMnLCAnYW5ndWxhci1sb2FkaW5nLWJhcicsICduZ01lc3NhZ2VzJywgXCJsZWFmbGV0LWRpcmVjdGl2ZVwiLCdjaGFydC5qcyddKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgWyd1aS5yb3V0ZXInLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJ10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbXSk7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJywgW10pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpe1xuXG5cdFx0dmFyIGdldFZpZXcgPSBmdW5jdGlvbih2aWV3TmFtZSl7XG5cdFx0XHRyZXR1cm4gJy92aWV3cy9hcHAvJyArIHZpZXdOYW1lICsgJy8nICsgdmlld05hbWUgKyAnLmh0bWwnO1xuXHRcdH07XG5cblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG5cblx0XHQkc3RhdGVQcm92aWRlclxuXHRcdFx0LnN0YXRlKCdhcHAnLCB7XG5cdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHQvKlx0c2lkZWJhcjoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3NpZGViYXInKVxuXHRcdFx0XHRcdH0sKi9cblx0XHRcdFx0XHRoZWFkZXI6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdoZWFkZXInKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bWFpbjoge31cblx0XHRcdFx0fVxuXHRcdFx0fSlcblxuXHRcdFx0LnN0YXRlKCdhcHAubGFuZGluZycsIHtcblx0XHRcdFx0dXJsOiAnLycsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ092ZXJ2aWV3J30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xhbmRpbmcnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmVwaScsIHtcblx0XHRcdFx0dXJsOiAnL2VwaScsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ0Vudmlyb25tZW50IFBlcmZvcm1hbmNlIEluZGV4J30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2VwaScpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWFwQCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hcCcpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5zdGFsbCcsIHtcblx0XHRcdFx0dXJsOiAnL2luc3RhbGwnLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdJbnN0YWxsJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luc3RhbGwnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnRhYnMnLCB7XG5cdFx0XHRcdHVybDogJy9mZWF0dXJlcycsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ0ZlYXR1cmVzJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3RhYnMnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmRlcGxveScsIHtcblx0XHRcdFx0dXJsOiAnL2RlcGxveScsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ0RlcGxveSd9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdkZXBsb3knKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnRoZW1lJywge1xuXHRcdFx0XHR1cmw6ICcvdGhlbWUnLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdUaGVtZSd9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd0aGVtZScpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudG9hc3RzJywge1xuXHRcdFx0XHR1cmw6ICcvdG9hc3RzJyxcblx0XHRcdFx0ZGF0YToge3BhZ2VOYW1lOiAnVG9hc3RzJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3RvYXN0cycpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuZGlhbG9ncycsIHtcblx0XHRcdFx0dXJsOiAnL2RpYWxvZ3MnLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdEaWFsb2dzJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2RpYWxvZ3MnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmdlbmVyYXRvcnMnLCB7XG5cdFx0XHRcdHVybDogJy9nZW5lcmF0b3JzJyxcblx0XHRcdFx0ZGF0YToge3BhZ2VOYW1lOiAnQXJ0aXNhbiBnZW5lcmF0b3JzJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2dlbmVyYXRvcnMnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmp3dF9hdXRoJywge1xuXHRcdFx0XHR1cmw6ICcvand0X2F1dGgnLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdKU09OIFdlYiBUb2tlbiBBdXRoZW50aWNhdGlvbid9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdqd3RfYXV0aCcpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuZWxpeGlyJywge1xuXHRcdFx0XHR1cmw6ICcvZWxpeGlyJyxcblx0XHRcdFx0ZGF0YToge3BhZ2VOYW1lOiAnRWxpeGlyJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2VsaXhpcicpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAucmVzdF9hcGknLCB7XG5cdFx0XHRcdHVybDogJy9yZXN0X2FwaScsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ1JFU1QgQVBJJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3Jlc3RfYXBpJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC51bnN1cHBvcnRlZF9icm93c2VyJywge1xuXHRcdFx0XHR1cmw6ICcvdW5zdXBwb3J0ZWRfYnJvd3NlcicsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ1Vuc3VwcG9ydGVkIEJyb3dzZXInfSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygndW5zdXBwb3J0ZWRfYnJvd3NlcicpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAubWlzYycsIHtcblx0XHRcdFx0dXJsOiAnL21pc2MnLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdNaXNjZWxsYW5lb3VzIGZlYXR1cmVzJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ21pc2MnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblxuXG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLnJ1bihmdW5jdGlvbigkcm9vdFNjb3BlKXtcblx0XHQkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcblxuXHRcdFx0aWYgKHRvU3RhdGUuZGF0YSAmJiB0b1N0YXRlLmRhdGEucGFnZU5hbWUpe1xuXHRcdFx0XHQkcm9vdFNjb3BlLmN1cnJlbnRfcGFnZSA9IHRvU3RhdGUuZGF0YS5wYWdlTmFtZTtcblx0XHRcdH1cblxuXG5cdFx0fSk7XG5cdFx0JHJvb3RTY29wZS4kb24oXCIkdmlld0NvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUpe1xuXHRcdFx0d2luZG93LlByaXNtLmhpZ2hsaWdodEFsbCgpO1xuXHRcdH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uICgkYXV0aFByb3ZpZGVyKXtcbiAgICAgICAgLy8gU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxuICAgICAgICAvLyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxuICAgICAgICAkYXV0aFByb3ZpZGVyLmxvZ2luVXJsID0gJy9hcGkvMS9hdXRoZW50aWNhdGUvYXV0aCc7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoQ2hhcnRKc1Byb3ZpZGVyKSB7XG5cdFx0Ly9cblx0XHRDaGFydEpzUHJvdmlkZXIuc2V0T3B0aW9ucyh7XG5cdFx0XHRjb2xvdXJzOiBbJyNGRjUyNTInLCAnI0ZGOEE4MCddLFxuXHRcdFx0cmVzcG9uc2l2ZTogdHJ1ZVxuXHRcdH0pO1xuXHRcdC8vIENvbmZpZ3VyZSBhbGwgbGluZSBjaGFydHNcblx0XHRDaGFydEpzUHJvdmlkZXIuc2V0T3B0aW9ucygnTGluZScsIHtcblx0XHRcdGRhdGFzZXRGaWxsOiBmYWxzZVxuXHRcdH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24gKGNmcExvYWRpbmdCYXJQcm92aWRlcil7XG5cdFx0Y2ZwTG9hZGluZ0JhclByb3ZpZGVyLmluY2x1ZGVTcGlubmVyID0gZmFsc2U7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKCBmdW5jdGlvbihSZXN0YW5ndWxhclByb3ZpZGVyKSB7XG5cdFx0UmVzdGFuZ3VsYXJQcm92aWRlclxuXHRcdC5zZXRCYXNlVXJsKCcvYXBpLzEvJyk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKCRtZFRoZW1pbmdQcm92aWRlcikge1xuXHRcdC8qIEZvciBtb3JlIGluZm8sIHZpc2l0IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhcmpzLm9yZy8jL1RoZW1pbmcvMDFfaW50cm9kdWN0aW9uICovXG5cdFx0JG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0Jylcblx0XHQucHJpbWFyeVBhbGV0dGUoJ2luZGlnbycpXG5cdFx0LmFjY2VudFBhbGV0dGUoJ2dyZXknKVxuXHRcdC53YXJuUGFsZXR0ZSgncmVkJyk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2NhcGl0YWxpemUnLCBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBmdW5jdGlvbihpbnB1dCwgYWxsKSB7XG5cdFx0XHRyZXR1cm4gKCEhaW5wdXQpID8gaW5wdXQucmVwbGFjZSgvKFteXFxXX10rW15cXHMtXSopICovZyxmdW5jdGlvbih0eHQpe1xuXHRcdFx0XHRyZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0fSkgOiAnJztcblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnaHVtYW5SZWFkYWJsZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGh1bWFuaXplKHN0cikge1xuXHRcdFx0aWYgKCAhc3RyICl7XG5cdFx0XHRcdHJldHVybiAnJztcblx0XHRcdH1cblx0XHRcdHZhciBmcmFncyA9IHN0ci5zcGxpdCgnXycpO1xuXHRcdFx0Zm9yICh2YXIgaT0wOyBpPGZyYWdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGZyYWdzW2ldID0gZnJhZ3NbaV0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBmcmFnc1tpXS5zbGljZSgxKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmcmFncy5qb2luKCcgJyk7XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICd0cnVzdEh0bWwnLCBmdW5jdGlvbiggJHNjZSApe1xuXHRcdHJldHVybiBmdW5jdGlvbiggaHRtbCApe1xuXHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwoaHRtbCk7XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3VjZmlyc3QnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGlucHV0ICkge1xuXHRcdFx0aWYgKCAhaW5wdXQgKXtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaW5wdXQuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zdWJzdHJpbmcoMSk7XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdNYXBTZXJ2aWNlJywgZnVuY3Rpb24obGVhZmxldERhdGEpe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgbGVhZmxldCA9IHt9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNldExlYWZsZXREYXRhOiBmdW5jdGlvbihsZWFmKXtcbiAgICAgICAgICAgIGxlYWZsZXQgPSBsZWFmbGV0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0TGVhZmxldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gbGVhZmxldDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdEaWFsb2dTZXJ2aWNlJywgZnVuY3Rpb24oJG1kRGlhbG9nKXtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmcm9tVGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlLCAkc2NvcGUpe1xuXG5cdFx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy8nICsgdGVtcGxhdGUgKyAnLmh0bWwnXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0aWYgKCRzY29wZSl7XG5cdFx0XHRcdFx0b3B0aW9ucy5zY29wZSA9ICRzY29wZS4kbmV3KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLnNob3cob3B0aW9ucyk7XG5cdFx0XHR9LFxuXG5cdFx0XHRoaWRlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcblx0XHRcdH0sXG5cblx0XHRcdGFsZXJ0OiBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XG5cdFx0XHRcdCRtZERpYWxvZy5zaG93KFxuXHRcdFx0XHRcdCRtZERpYWxvZy5hbGVydCgpXG5cdFx0XHRcdFx0XHQudGl0bGUodGl0bGUpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0Lm9rKCdPaycpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdUb2FzdFNlcnZpY2UnLCBmdW5jdGlvbigkbWRUb2FzdCl7XG5cblx0XHR2YXIgZGVsYXkgPSA2MDAwLFxuXHRcdFx0cG9zaXRpb24gPSAndG9wIHJpZ2h0Jyxcblx0XHRcdGFjdGlvbiA9ICdPSyc7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvdzogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcblx0XHRcdFx0XHRcdC5oaWRlRGVsYXkoZGVsYXkpXG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LnRoZW1lKCd3YXJuJylcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdEaWFsb2dzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG5cdFx0JHNjb3BlLmFsZXJ0RGlhbG9nID0gZnVuY3Rpb24oKXtcblx0XHRcdERpYWxvZ1NlcnZpY2UuYWxlcnQoJ1RoaXMgaXMgYW4gYWxlcnQgdGl0bGUnLCAnWW91IGNhbiBzcGVjaWZ5IHNvbWUgZGVzY3JpcHRpb24gdGV4dCBpbiBoZXJlLicpO1xuXHRcdH07XG5cblx0XHQkc2NvcGUuY3VzdG9tRGlhbG9nID0gZnVuY3Rpb24oKXtcblx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdhZGRfdXNlcnMnLCAkc2NvcGUpO1xuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRWxpeGlyQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXBpQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUsIFJlc3Rhbmd1bGFyLCBsZWFmbGV0RGF0YSwgTWFwU2VydmljZSkge1xuXHRcdCRzY29wZS5jdXJyZW50ID0gXCJcIjtcblx0XHQkc2NvcGUubGFiZWxzID0gW1wiSmFudWFyeVwiLCBcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiLCBcIk1heVwiLCBcIkp1bmVcIiwgXCJKdWx5XCJdO1xuXHRcdCRzY29wZS5zZXJpZXMgPSBbJ1NlcmllcyBBJywgJ1NlcmllcyBCJ107XG5cdFx0JHNjb3BlLmRhdGEgPSBbXG5cdFx0XHRbNjUsIDU5LCA4MCwgODEsIDU2LCA1NSwgNDBdLFxuXHRcdFx0WzI4LCA0OCwgNDAsIDE5LCA4NiwgMjcsIDkwXVxuXHRcdF07XG5cdFx0dmFyIGVwaSA9IFJlc3Rhbmd1bGFyLmFsbCgnZXBpJyk7XG5cdFx0ZXBpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHQkc2NvcGUuZXBpID0gZGF0YTtcblx0XHRcdCRzY29wZS5kcmF3Q291bnRyaWVzKCk7XG5cdFx0fSk7XG5cdFx0JHNjb3BlLnNldEN1cnJlbnQgPSBmdW5jdGlvbiAobmF0KSB7XG5cdFx0XHQkc2NvcGUuY3VycmVudCA9IG5hdDtcblx0XHR9O1xuXHRcdCRzY29wZS5nZXRPZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoISRzY29wZS5jdXJyZW50KSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICRzY29wZS5jdXJyZW50LnJhbmsgLSAyIHx8IDA7XG5cdFx0fTtcblx0XHQkc2NvcGUuZ2V0VGVuZGVuY3kgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoISRzY29wZS5jdXJyZW50KSB7XG5cdFx0XHRcdHJldHVybiAnYXJyb3dfZHJvcF9kb3duJ1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICRzY29wZS5jdXJyZW50LnBlcmNlbnRfY2hhbmdlID4gMCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuXHRcdH07XG5cdFx0dmFyIGdldE5hdGlvbkJ5TmFtZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmVwaSwgZnVuY3Rpb24gKG5hdCkge1xuXHRcdFx0XHRpZiAobmF0LmNvdW50cnkgPT0gbmFtZSkge1xuXHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbmF0aW9uO1xuXHRcdH07XG5cblx0XHR2YXIgY3JlYXRlQ2FudmFzID0gZnVuY3Rpb24gKGNvbG9ycykge1xuXHRcdFx0JHNjb3BlLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdFx0JHNjb3BlLmNhbnZhcy53aWR0aCA9IDI1Njtcblx0XHRcdCRzY29wZS5jYW52YXMuaGVpZ2h0ID0gMTA7XG5cdFx0XHQkc2NvcGUuY3R4ID0gJHNjb3BlLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0dmFyIGdyYWRpZW50ID0gJHNjb3BlLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyNTYsIDEwKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTMsICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0JHNjb3BlLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdCRzY29wZS5jdHguZmlsbFJlY3QoMCwgMCwgMjU2LCAxMCk7XG5cdFx0XHQkc2NvcGUucGFsZXR0ZSA9ICRzY29wZS5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NiwgMSkuZGF0YTtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQoJHNjb3BlLmNhbnZhcyk7XG5cdFx0fVxuXHRcdGNyZWF0ZUNhbnZhcygpO1xuXHRcdCRzY29wZS5kcmF3Q291bnRyaWVzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRjb25zb2xlLmxvZyhNYXBTZXJ2aWNlLmdldExlYWZsZXREYXRhKCkpO1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcblx0XHRcdFx0Ly9cdEwudGlsZUxheWVyKCdodHRwOi8vbG9jYWxob3N0OjMwMDEvc2VydmljZXMvcG9zdGdpcy9jb3VudHJpZXNfYmlnL2dlb20vZHluYW1pY01hcC97en0ve3h9L3t5fS5wbmcnKS5hZGRUbyhtYXApO1xuXHRcdFx0XHR2YXIgZGVidWcgPSB7fTtcblxuXHRcdFx0XHR2YXIgYXBpS2V5ID0gJ3BrLmV5SjFJam9pYldGbmJtOXNieUlzSW1FaU9pSnVTRmRVWWtnNEluMC41SE95a0trMHBOUDFOM2lzZlBRR1RRJztcblx0XHRcdFx0dmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjMwMDEvc2VydmljZXMvcG9zdGdpcy9jb3VudHJpZXNfYmlnL2dlb20vdmVjdG9yLXRpbGVzL3t6fS97eH0ve3l9LnBiZj9maWVsZHM9aWQsYWRtaW4sYWRtMF9hMyxuYW1lLG5hbWVfbG9uZyc7IC8vXG5cdFx0XHRcdHZhciB1cmwyID0gJ2h0dHBzOi8vYS50aWxlcy5tYXBib3guY29tL3Y0L21hcGJveC5tYXBib3gtc3RyZWV0cy12Ni1kZXYve3p9L3t4fS97eX0udmVjdG9yLnBiZj9hY2Nlc3NfdG9rZW49JyArIGFwaUtleTtcblx0XHRcdFx0dmFyIG12dFNvdXJjZSA9IG5ldyBMLlRpbGVMYXllci5NVlRTb3VyY2Uoe1xuXHRcdFx0XHRcdHVybDogdXJsLCAvL1wiaHR0cDovL3NwYXRpYWxzZXJ2ZXIuc3BhdGlhbGRldi5jb20vc2VydmljZXMvdmVjdG9yLXRpbGVzL2dhdWxfZnNwX2luZGlhL3t6fS97eH0ve3l9LnBiZlwiLFxuXHRcdFx0XHRcdGRlYnVnOiBmYWxzZSxcblx0XHRcdFx0XHRjbGlja2FibGVMYXllcnM6IFsnY291bnRyaWVzX2JpZ19nZW9tJ10sXG5cdFx0XHRcdFx0bXV0ZXhUb2dnbGU6IHRydWUsXG5cdFx0XHRcdFx0b25DbGljazogZnVuY3Rpb24gKGV2dCwgdCkge1xuXHRcdFx0XHRcdFx0Ly9tYXAuZml0Qm91bmRzKGV2dC50YXJnZXQuZ2V0Qm91bmRzKCkpO1xuXHRcdFx0XHRcdFx0aWYoJHNjb3BlLmN1cnJlbnQuY291bnRyeSAhPSBldnQuZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbWluKXtcblx0XHRcdFx0XHRcdFx0bWFwLnBhblRvKGV2dC5sYXRsbmcpO1xuXHRcdFx0XHRcdFx0XHRtYXAucGFuQnkobmV3IEwuUG9pbnQoLTIwMCwwKSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkc2NvcGUuY3VycmVudCA9IGdldE5hdGlvbkJ5TmFtZShldnQuZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbWluKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGdldElERm9yTGF5ZXJGZWF0dXJlOiBmdW5jdGlvbiAoZmVhdHVyZSkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmVhdHVyZS5wcm9wZXJ0aWVzLmlkO1xuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBUaGUgZmlsdGVyIGZ1bmN0aW9uIGdldHMgY2FsbGVkIHdoZW4gaXRlcmF0aW5nIHRob3VnaCBlYWNoIHZlY3RvciB0aWxlIGZlYXR1cmUgKHZ0ZikuIFlvdSBoYXZlIGFjY2Vzc1xuXHRcdFx0XHRcdCAqIHRvIGV2ZXJ5IHByb3BlcnR5IGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIGZlYXR1cmUgKHRoZSBmZWF0dXJlLCBhbmQgdGhlIGxheWVyKS4gWW91IGNhbiBhbHNvIGZpbHRlclxuXHRcdFx0XHRcdCAqIGJhc2VkIG9mIHRoZSBjb250ZXh0IChlYWNoIHRpbGUgdGhhdCB0aGUgZmVhdHVyZSBpcyBkcmF3biBvbnRvKS5cblx0XHRcdFx0XHQgKlxuXHRcdFx0XHRcdCAqIFJldHVybmluZyBmYWxzZSBza2lwcyBvdmVyIHRoZSBmZWF0dXJlIGFuZCBpdCBpcyBub3QgZHJhd24uXG5cdFx0XHRcdFx0ICpcblx0XHRcdFx0XHQgKiBAcGFyYW0gZmVhdHVyZVxuXHRcdFx0XHRcdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGZpbHRlcjogZnVuY3Rpb24gKGZlYXR1cmUsIGNvbnRleHQpIHtcblxuXHRcdFx0XHRcdFx0aWYgKGZlYXR1cmUubGF5ZXIubmFtZSA9PT0gJ2FkbWluJyB8fCBmZWF0dXJlLmxheWVyLm5hbWUgPT09ICdnYXVsXzIwMTRfYWRtMV9sYWJlbCcpIHtcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhmZWF0dXJlKTtcblx0XHRcdFx0XHRcdFx0aWYgKGZlYXR1cmUucHJvcGVydGllcy5hZG1pbl9sZXZlbCA9PSAwIHx8IGZlYXR1cmUucHJvcGVydGllcy5hZG1pbl9sZXZlbCA9PSAxIHx8IGZlYXR1cmUucHJvcGVydGllcy5hZG1pbl9sZXZlbCA9PSAyKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHRzdHlsZTogZnVuY3Rpb24gKGZlYXR1cmUpIHtcblx0XHRcdFx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0XHRcdFx0dmFyIG5hdGlvbiA9IGdldE5hdGlvbkJ5TmFtZShmZWF0dXJlLnByb3BlcnRpZXMuYWRtaW4pO1xuXHRcdFx0XHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTogLy8nUG9pbnQnXG5cdFx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoNDksNzksNzksMC4wMSknO1xuXHRcdFx0XHRcdFx0XHRzdHlsZS5yYWRpdXMgPSA1O1xuXHRcdFx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwwLDAuNSknLFxuXHRcdFx0XHRcdFx0XHRcdHJhZGl1czogMFxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMjogLy8nTGluZVN0cmluZydcblx0XHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMCwwLDEpJztcblx0XHRcdFx0XHRcdFx0c3R5bGUuc2l6ZSA9IDE7XG5cdFx0XHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjUsMCwxKScsXG5cdFx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0XHRcdFx0aWYgKG5hdGlvbi5zY29yZSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIG5hdGlvbi5zY29yZSkgKiA0O1xuXHRcdFx0XHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyAkc2NvcGUucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgJHNjb3BlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyAkc2NvcGUucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgJHNjb3BlLnBhbGV0dGVbY29sb3JQb3MgKzNdICsgJyknO1xuXHRcdFx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gY29sb3I7XG5cdFx0XHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg1MCw1MCw1MCwwLjQpJyxcblx0XHRcdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDAuMCknLFxuXHRcdFx0XHRcdFx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMC41KScsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG5cdFx0XHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG5cdFx0XHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvL1x0aWYgKGZlYXR1cmUubGF5ZXIubmFtZSA9PT0gJ2dhdWxfMjAxNF9hZG0xX2xhYmVsJykge1xuXHRcdFx0XHRcdFx0c3R5bGUuYWpheFNvdXJjZSA9IGZ1bmN0aW9uIChtdnRGZWF0dXJlKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBpZCA9IG12dEZlYXR1cmUuaWQ7XG5cdFx0XHRcdFx0XHRcdC8vXHRjb25zb2xlLmxvZyhpZCk7XG5cdFx0XHRcdFx0XHRcdC8vcmV0dXJuICdodHRwOi8vc3BhdGlhbHNlcnZlci5zcGF0aWFsZGV2LmNvbS9mc3AvMjAxNC9mc3AvYWdncmVnYXRpb25zLW5vLW5hbWUvJyArIGlkICsgJy5qc29uJztcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdHN0eWxlLnN0YXRpY0xhYmVsID0gZnVuY3Rpb24gKG12dEZlYXR1cmUsIGFqYXhEYXRhKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBzdHlsZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRodG1sOiBhamF4RGF0YS50b3RhbF9jb3VudCxcblx0XHRcdFx0XHRcdFx0XHRpY29uU2l6ZTogWzMzLCAzM10sXG5cdFx0XHRcdFx0XHRcdFx0Y3NzQ2xhc3M6ICdsYWJlbC1pY29uLW51bWJlcicsXG5cdFx0XHRcdFx0XHRcdFx0Y3NzU2VsZWN0ZWRDbGFzczogJ2xhYmVsLWljb24tbnVtYmVyLXNlbGVjdGVkJ1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0Ly9cdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBXaGVuIHdlIHdhbnQgdG8gbGluayBldmVudHMgYmV0d2VlbiBsYXllcnMsIGxpa2UgY2xpY2tpbmcgb24gYSBsYWJlbCBhbmQgYVxuXHRcdFx0XHRcdCAqIGNvcnJlc3BvbmRpbmcgcG9seWdvbiBmcmVhdHVyZSwgdGhpcyB3aWxsIHJldHVybiB0aGUgY29ycmVzcG9uZGluZyBtYXBwaW5nXG5cdFx0XHRcdFx0ICogYmV0d2VlbiBsYXllcnMuIFRoaXMgcHJvdmlkZXMga25vd2xlZGdlIG9mIHdoaWNoIG90aGVyIGZlYXR1cmUgYSBnaXZlbiBmZWF0dXJlXG5cdFx0XHRcdFx0ICogaXMgbGlua2VkIHRvLlxuXHRcdFx0XHRcdCAqXG5cdFx0XHRcdFx0ICogQHBhcmFtIGxheWVyTmFtZSAgdGhlIGxheWVyIHdlIHdhbnQgdG8ga25vdyB0aGUgbGlua2VkIGxheWVyIGZyb21cblx0XHRcdFx0XHQgKiBAcmV0dXJucyB7c3RyaW5nfSByZXR1cm5zIGNvcnJlc3BvbmRpbmcgbGlua2VkIGxheWVyXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0bGF5ZXJMaW5rOiBmdW5jdGlvbiAobGF5ZXJOYW1lKSB7XG5cdFx0XHRcdFx0XHRpZiAobGF5ZXJOYW1lLmluZGV4T2YoJ19sYWJlbCcpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGxheWVyTmFtZS5yZXBsYWNlKCdfbGFiZWwnLCAnJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gbGF5ZXJOYW1lICsgJ19sYWJlbCc7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRkZWJ1Zy5tdnRTb3VyY2UgPSBtdnRTb3VyY2U7XG5cdFx0XHRcdG1hcC5hZGRMYXllcihtdnRTb3VyY2UpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignR2VuZXJhdG9yc0N0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdIZWFkZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlKXtcblxuXHRcdCRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiAkcm9vdFNjb3BlLmN1cnJlbnRfcGFnZTtcblx0XHR9LCBmdW5jdGlvbihuZXdQYWdlKXtcblx0XHRcdCRzY29wZS5jdXJyZW50X3BhZ2UgPSBuZXdQYWdlIHx8ICdQYWdlIE5hbWUnO1xuXHRcdH0pO1xuXG5cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdKd3RBdXRoQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGF1dGgsIFJlc3Rhbmd1bGFyKXtcblxuXHRcdHZhciBjcmVkZW50aWFscyA9IHt9O1xuXG5cdFx0JHNjb3BlLnJlcXVlc3RUb2tlbiA9IGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBVc2UgU2F0ZWxsaXplcidzICRhdXRoIHNlcnZpY2UgdG8gbG9naW4gYmVjYXVzZSBpdCdsbCBhdXRvbWF0aWNhbGx5IHNhdmUgdGhlIEpXVCBpbiBsb2NhbFN0b3JhZ2Vcblx0XHRcdCRhdXRoLmxvZ2luKGNyZWRlbnRpYWxzKS50aGVuKGZ1bmN0aW9uIChkYXRhKXtcblx0XHRcdFx0Ly8gSWYgbG9naW4gaXMgc3VjY2Vzc2Z1bCwgcmVkaXJlY3QgdG8gdGhlIHVzZXJzIHN0YXRlXG5cdFx0XHRcdC8vJHN0YXRlLmdvKCdkYXNoYm9hcmQnKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHQvLyBUaGlzIHJlcXVlc3Qgd2lsbCBoaXQgdGhlIGdldERhdGEgbWV0aG9kIGluIHRoZSBBdXRoZW50aWNhdGVDb250cm9sbGVyXG5cdFx0Ly8gb24gdGhlIExhcmF2ZWwgc2lkZSBhbmQgd2lsbCByZXR1cm4geW91ciBkYXRhIHRoYXQgcmVxdWlyZSBhdXRoZW50aWNhdGlvblxuXHRcdCRzY29wZS5nZXREYXRhID0gZnVuY3Rpb24oKXtcblx0XHRcdFJlc3Rhbmd1bGFyLmFsbCgnYXV0aGVudGljYXRlL2RhdGEnKS5nZXQoKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG5cblx0XHRcdH0sIGZ1bmN0aW9uIChlcnJvcil7fSk7XG5cdFx0fTtcblxuXG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xhbmRpbmdDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbWRUb2FzdCwgJG1kRGlhbG9nLCAkaW50ZXJ2YWwsIFRvYXN0U2VydmljZSwgRGlhbG9nU2VydmljZSl7XG5cblx0XHQkc2NvcGUucHJvbW9JbWFnZSA9ICdodHRwczovL2kuaW1ndXIuY29tL1piTHpPUFAuanBnJztcblx0XHQkc2NvcGUuaWNvbiA9ICdzZW5kJztcblxuXHRcdHZhciBpY29ucyA9IFtcblx0XHRcdFx0J29mZmljZScsICdmYWNlYm9vaycsICd0d2l0dGVyJywgJ2FwcGxlJywgJ3doYXRzYXBwJywgJ2xpbmtlZGluJywgJ3dpbmRvd3MnLCAnYWNjZXNzaWJpbGl0eScsICdhbGFybScsICdhc3BlY3RfcmF0aW8nLFxuXHRcdFx0XHQnYXV0b3JlbmV3JywgJ2Jvb2ttYXJrX291dGxpbmUnLCAnZGFzaGJvYXJkJywgJ2RucycsICdmYXZvcml0ZV9vdXRsaW5lJywgJ2dldF9hcHAnLCAnaGlnaGxpZ2h0X3JlbW92ZScsICdoaXN0b3J5JywgJ2xpc3QnLFxuXHRcdFx0XHQncGljdHVyZV9pbl9waWN0dXJlJywgJ3ByaW50JywgJ3NldHRpbmdzX2V0aGVybmV0JywgJ3NldHRpbmdzX3Bvd2VyJywgJ3Nob3BwaW5nX2NhcnQnLCAnc3BlbGxjaGVjaycsICdzd2FwX2hvcml6JywgJ3N3YXBfdmVydCcsXG5cdFx0XHRcdCd0aHVtYl91cCcsICd0aHVtYnNfdXBfZG93bicsICd0cmFuc2xhdGUnLCAndHJlbmRpbmdfdXAnLCAndmlzaWJpbGl0eScsICd3YXJuaW5nJywgJ21pYycsICdwbGF5X2NpcmNsZV9vdXRsaW5lJywgJ3JlcGVhdCcsXG5cdFx0XHRcdCdza2lwX25leHQnLCAnY2FsbCcsICdjaGF0JywgJ2NsZWFyX2FsbCcsICdkaWFscGFkJywgJ2RuZF9vbicsICdmb3J1bScsICdsb2NhdGlvbl9vbicsICd2cG5fa2V5JywgJ2ZpbHRlcl9saXN0JywgJ2luYm94Jyxcblx0XHRcdFx0J2xpbmsnLCAncmVtb3ZlX2NpcmNsZV9vdXRsaW5lJywgJ3NhdmUnLCAndGV4dF9mb3JtYXQnLCAnYWNjZXNzX3RpbWUnLCAnYWlycGxhbmVtb2RlX29uJywgJ2JsdWV0b290aCcsICdkYXRhX3VzYWdlJyxcblx0XHRcdFx0J2dwc19maXhlZCcsICdub3dfd2FsbHBhcGVyJywgJ25vd193aWRnZXRzJywgJ3N0b3JhZ2UnLCAnd2lmaV90ZXRoZXJpbmcnLCAnYXR0YWNoX2ZpbGUnLCAnZm9ybWF0X2xpbmVfc3BhY2luZycsXG5cdFx0XHRcdCdmb3JtYXRfbGlzdF9udW1iZXJlZCcsICdmb3JtYXRfcXVvdGUnLCAndmVydGljYWxfYWxpZ25fY2VudGVyJywgJ3dyYXBfdGV4dCcsICdjbG91ZF9xdWV1ZScsICdmaWxlX2Rvd25sb2FkJywgJ2ZvbGRlcl9vcGVuJyxcblx0XHRcdFx0J2Nhc3QnLCAnaGVhZHNldCcsICdrZXlib2FyZF9iYWNrc3BhY2UnLCAnbW91c2UnLCAnc3BlYWtlcicsICd3YXRjaCcsICdhdWRpb3RyYWNrJywgJ2VkaXQnLCAnYnJ1c2gnLCAnbG9va3MnLCAnY3JvcF9mcmVlJyxcblx0XHRcdFx0J2NhbWVyYScsICdmaWx0ZXJfdmludGFnZScsICdoZHJfc3Ryb25nJywgJ3Bob3RvX2NhbWVyYScsICdzbGlkZXNob3cnLCAndGltZXInLCAnZGlyZWN0aW9uc19iaWtlJywgJ2hvdGVsJywgJ2xvY2FsX2xpYnJhcnknLFxuXHRcdFx0XHQnZGlyZWN0aW9uc193YWxrJywgJ2xvY2FsX2NhZmUnLCAnbG9jYWxfcGl6emEnLCAnbG9jYWxfZmxvcmlzdCcsICdteV9sb2NhdGlvbicsICduYXZpZ2F0aW9uJywgJ3Bpbl9kcm9wJywgJ2Fycm93X2JhY2snLCAnbWVudScsXG5cdFx0XHRcdCdjbG9zZScsICdtb3JlX2hvcml6JywgJ21vcmVfdmVydCcsICdyZWZyZXNoJywgJ3Bob25lX3BhdXNlZCcsICd2aWJyYXRpb24nLCAnY2FrZScsICdncm91cCcsICdtb29kJywgJ3BlcnNvbicsXG5cdFx0XHRcdCdub3RpZmljYXRpb25zX25vbmUnLCAncGx1c19vbmUnLCAnc2Nob29sJywgJ3NoYXJlJywgJ3N0YXJfb3V0bGluZSdcblx0XHRcdF0sXG5cdFx0XHRjb3VudGVyID0gMDtcblxuXHRcdCRpbnRlcnZhbChmdW5jdGlvbigpe1xuXHRcdFx0JHNjb3BlLmljb24gPSBpY29uc1srK2NvdW50ZXJdO1xuXHRcdFx0aWYgKGNvdW50ZXIgPiAxMTIpe1xuXHRcdFx0XHRjb3VudGVyID0gMDtcblx0XHRcdH1cblx0XHR9LCAyMDAwKTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXBDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJHRpbWVvdXQsIE1hcFNlcnZpY2UsIGxlYWZsZXREYXRhLCAkaHR0cCkge1xuXHRcdC8vXG5cdFx0dmFyIGFwaUtleSA9ICdway5leUoxSWpvaWJXRm5ibTlzYnlJc0ltRWlPaUp1U0ZkVVlrZzRJbjAuNUhPeWtLazBwTlAxTjNpc2ZQUUdUUSc7XG5cblx0XHQvKiRzY29wZS5kZWZhdWx0cyA9IHtcblx0XHRcdHRpbGVMYXllcjogJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvbWFwYm94LnBlbmNpbC97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXksXG5cdFx0XHRtYXhab29tOiAxNCxcblx0XHRcdGRldGVjdFJldGluYTogdHJ1ZSxcblx0XHRcdGF0dHJpYnV0aW9uOiAnJ1xuXHRcdH07XG5cdFx0JHNjb3BlLmNlbnRlciA9IHtcblx0XHRcdGxhdDogMCxcblx0XHRcdGxuZzogMCxcblx0XHRcdHpvb206IDNcblx0XHR9OyovXG5cdFx0YW5ndWxhci5leHRlbmQoJHNjb3BlLCB7XG5cdFx0XHRjZW50ZXI6IHtcblx0XHRcdFx0bGF0OiAwLFxuXHRcdFx0XHRsbmc6IDAsXG5cdFx0XHRcdHpvb206IDNcblx0XHRcdH0sXG5cdFx0XHRsYXllcnM6IHtcblx0XHRcdFx0YmFzZWxheWVyczoge1xuXHRcdFx0XHRcdHh5ejoge1xuXHRcdFx0XHRcdFx0bmFtZTogJ01hcEJveCBQZW5jaWwnLFxuXHRcdFx0XHRcdFx0dXJsOiAnaHR0cHM6Ly97c30udGlsZXMubWFwYm94LmNvbS92NC9tYXBib3gucGVuY2lsL3t6fS97eH0ve3l9LnBuZz9hY2Nlc3NfdG9rZW49JyArIGFwaUtleSxcblx0XHRcdFx0XHRcdHR5cGU6ICd4eXonXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvdmVybGF5czoge1xuXHRcdFx0XHRcdGRlbW9zdXRmZ3JpZDoge1xuXHRcdFx0XHRcdFx0bmFtZTogJ1VURkdyaWQgSW50ZXJhY3Rpdml0eScsXG5cdFx0XHRcdFx0XHR0eXBlOiAndXRmR3JpZCcsXG5cdFx0XHRcdFx0XHR1cmw6ICdodHRwOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjMvbWFwYm94Lmdlb2dyYXBoeS1jbGFzcy97en0ve3h9L3t5fS5ncmlkLmpzb24/Y2FsbGJhY2s9e2NifScsXG5cdFx0XHRcdFx0XHR2aXNpYmxlOiB0cnVlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JHNjb3BlLnNlYXJjaElQID0gZnVuY3Rpb24gKGlwKSB7XG5cdFx0XHR2YXIgdXJsID0gXCJodHRwOi8vZnJlZWdlb2lwLm5ldC9qc29uL1wiICsgaXA7XG5cdFx0XHQkaHR0cC5nZXQodXJsKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0JHNjb3BlLmNlbnRlciA9IHtcblx0XHRcdFx0XHRsYXQ6IHJlcy5sYXRpdHVkZSxcblx0XHRcdFx0XHRsbmc6IHJlcy5sb25naXR1ZGUsXG5cdFx0XHRcdFx0em9vbTogM1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRzY29wZS5pcCA9IHJlcy5pcDtcblx0XHRcdH0pXG5cdFx0fTtcblxuXHRcdCRzY29wZS5zZWFyY2hJUChcIlwiKTtcblx0XHQkc2NvcGUuaW50ZXJhY3Rpdml0eSA9IFwiXCI7XG5cdFx0JHNjb3BlLmZsYWcgPSBcIlwiO1xuXHRcdCRzY29wZS4kb24oJ2xlYWZsZXREaXJlY3RpdmVNYXAudXRmZ3JpZE1vdXNlb3ZlcicsIGZ1bmN0aW9uIChldmVudCwgbGVhZmxldEV2ZW50KSB7XG5cdFx0XHQvLyB0aGUgVVRGR3JpZCBpbmZvcm1hdGlvbiBpcyBvbiBsZWFmbGV0RXZlbnQuZGF0YVxuXHRcdFx0JHNjb3BlLmludGVyYWN0aXZpdHkgPSBsZWFmbGV0RXZlbnQuZGF0YS5hZG1pbjtcblx0XHRcdCRzY29wZS5mbGFnID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsXCIgKyBsZWFmbGV0RXZlbnQuZGF0YS5mbGFnX3BuZztcblxuXHRcdH0pO1xuXHRcdCRzY29wZS4kb24oJ2xlYWZsZXREaXJlY3RpdmVNYXAudXRmZ3JpZE1vdXNlb3V0JywgZnVuY3Rpb24gKGV2ZW50LCBsZWFmbGV0RXZlbnQpIHtcblx0XHRcdCRzY29wZS5pbnRlcmFjdGl2aXR5ID0gXCJcIjtcblx0XHRcdCRzY29wZS5mbGFnID0gXCJcIjtcblx0XHR9KTtcblx0XHRNYXBTZXJ2aWNlLnNldExlYWZsZXREYXRhKGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykpO1xuXG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01pc2NDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Jlc3RBcGlDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG5cblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Rhc2hib2FyZEN0cmwnLCBmdW5jdGlvbigpe1xuXG5cdH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVG9hc3RzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVG9hc3RTZXJ2aWNlKXtcblxuXHRcdCRzY29wZS50b2FzdFN1Y2Nlc3MgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLnNob3coJ1VzZXIgYWRkZWQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdH07XG5cblx0XHQkc2NvcGUudG9hc3RFcnJvciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoJ0Nvbm5lY3Rpb24gaW50ZXJydXB0ZWQhJyk7XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbiAoKXtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVXNlcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG5cdCAgICAgICAgLy9kbyBzb21ldGhpbmcgdXNlZnVsXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQnViYmxlc0N0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnYnViYmxlcycsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZWZhdWx0cztcblx0XHRkZWZhdWx0cyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0d2lkdGg6IDk0MCxcblx0XHRcdFx0aGVpZ2h0OiA2MDAsXG5cdFx0XHRcdGxheW91dF9ncmF2aXR5OiAtMC4wNixcblx0XHRcdFx0dmlzOiBudWxsLFxuXHRcdFx0XHRmb3JjZTogbnVsbCxcblx0XHRcdFx0ZGFtcGVyOiAwLjEsXG5cdFx0XHRcdGNpcmNsZXM6IG51bGwsXG5cdFx0XHRcdGZpbGxfY29sb3I6IGQzLnNjYWxlLm9yZGluYWwoKS5kb21haW4oW1wiZWhcIiwgXCJldlwiXSkucmFuZ2UoW1wiI2EzMTAzMVwiLCBcIiNiZWNjYWVcIl0pLFxuXHRcdFx0XHRtYXhfYW1vdW50OiAnJyxcblx0XHRcdFx0cmFkaXVzX3NjYWxlOiAnJyxcblx0XHRcdFx0Ly90b29sdGlwOiBDdXN0b21Ub29sdGlwKFwiZ2F0ZXNfdG9vbHRpcFwiLCAyNDApXG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRjb250cm9sbGVyOiAnQnViYmxlc0N0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0Y2hhcnRkYXRhOiAnPScsXG5cdFx0XHRcdGRpcmVjdGlvbjogJz0nLFxuXHRcdFx0XHRncmF2aXR5OiAnPScsXG5cdFx0XHRcdHNpemVmYWN0b3I6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycykge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksIGF0dHJzKTtcblx0XHRcdFx0dmFyIG5vZGVzID0gW107XG5cblx0XHRcdFx0dmFyIG1heF9hbW91bnQgPSBkMy5tYXgoc2NvcGUuY2hhcnRkYXRhLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhcnNlSW50KGQudmFsdWUpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRvcHRpb25zLnJhZGl1c19zY2FsZSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KDAuNSkuZG9tYWluKFswLCBtYXhfYW1vdW50XSkucmFuZ2UoWzIsIDg1XSk7XG5cdFx0XHRcdG9wdGlvbnMuY2VudGVyID0ge1xuXHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0IC8gMlxuXHRcdFx0XHR9O1xuXHRcdFx0XHRvcHRpb25zLmNhdF9jZW50ZXJzID0ge1xuXHRcdFx0XHRcdFwiZXZcIjoge1xuXHRcdFx0XHRcdFx0eDogb3B0aW9ucy53aWR0aCAvIDIsXG5cdFx0XHRcdFx0XHR5OiBvcHRpb25zLmhlaWdodCAvIDEwMCAqIDUwLFxuXHRcdFx0XHRcdFx0ZGFtcGVyOiAwLjFcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0XCJlaFwiOiB7XG5cdFx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0IC8gMTAwICogNDUsXG5cdFx0XHRcdFx0XHRkYW1wZXI6IDAuMVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNyZWF0ZV9ub2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdG5vZGVzID0gW3tcblx0XHRcdFx0XHRcdGlkOiAxLFxuXHRcdFx0XHRcdFx0dHlwZTogJ2VoX2hpJyxcblx0XHRcdFx0XHRcdHJhZGl1czogc2NvcGUuY2hhcnRkYXRhLmVoX2hpIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdHZhbHVlOiBzY29wZS5jaGFydGRhdGEuZWhfaGkgLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0bmFtZTogJ0hlYWx0aCBJbXBhY3QnLFxuXHRcdFx0XHRcdFx0Z3JvdXA6ICdlaCcsXG5cdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueSxcblx0XHRcdFx0XHRcdGNvbG9yOiAnI2EzMTAzMSdcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHRpZDogMixcblx0XHRcdFx0XHRcdHR5cGU6ICdlaF9hcScsXG5cdFx0XHRcdFx0XHRyYWRpdXM6IHNjb3BlLmNoYXJ0ZGF0YS5laF9hcSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhLmVoX2FxIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdG5hbWU6ICdBaXIgUXVhbGl0eScsXG5cdFx0XHRcdFx0XHRncm91cDogJ2VoJyxcblx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55LFxuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2IoMCwyNTUsMCknXG5cdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0aWQ6IDMsXG5cdFx0XHRcdFx0XHR0eXBlOiAnZWhfd3MnLFxuXHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGEuZWhfd3MgLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0dmFsdWU6IHNjb3BlLmNoYXJ0ZGF0YS5laF93cyAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRuYW1lOiAnV2F0ZXIgU2FuaXRhdGlvbicsXG5cdFx0XHRcdFx0XHRncm91cDogJ2VoJyxcblx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55XG5cdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0aWQ6IDQsXG5cdFx0XHRcdFx0XHR0eXBlOiAnZXZfd3InLFxuXHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGEuZXZfd3IgLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0dmFsdWU6IHNjb3BlLmNoYXJ0ZGF0YS5ldl93ciAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRuYW1lOiAnV2F0ZXIgUmVzb3VyY2VzJyxcblx0XHRcdFx0XHRcdGdyb3VwOiAnZXYnLFxuXHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnlcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHRpZDogNSxcblx0XHRcdFx0XHRcdHR5cGU6ICdldl9hZycsXG5cdFx0XHRcdFx0XHRyYWRpdXM6IHNjb3BlLmNoYXJ0ZGF0YS5ldl9hZyAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhLmV2X2FnIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdG5hbWU6ICdBZ3JpY3VsdHVyZScsXG5cdFx0XHRcdFx0XHRncm91cDogJ2V2Jyxcblx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55XG5cdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0aWQ6IDYsXG5cdFx0XHRcdFx0XHR0eXBlOiAnZXZfZm8nLFxuXHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGEuZXZfZm8gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0dmFsdWU6IHNjb3BlLmNoYXJ0ZGF0YS5ldl9mbyAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRuYW1lOiAnRm9yZXN0Jyxcblx0XHRcdFx0XHRcdGdyb3VwOiAnZXYnLFxuXHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnlcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHRpZDogNyxcblx0XHRcdFx0XHRcdHR5cGU6ICdldl9maScsXG5cdFx0XHRcdFx0XHRyYWRpdXM6IHNjb3BlLmNoYXJ0ZGF0YS5ldl9maSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhLmV2X2ZpIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdG5hbWU6ICdGaXNoZXJpZXMnLFxuXHRcdFx0XHRcdFx0Z3JvdXA6ICdldicsXG5cdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueVxuXHRcdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcdGlkOiA4LFxuXHRcdFx0XHRcdFx0dHlwZTogJ2V2X2JkJyxcblx0XHRcdFx0XHRcdHJhZGl1czogc2NvcGUuY2hhcnRkYXRhLmV2X2JkIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdHZhbHVlOiBzY29wZS5jaGFydGRhdGEuZXZfYmQgLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0bmFtZTogJ0Jpb2RpdmVyc2l0eSBhbmQgSGFiaXRhdCcsXG5cdFx0XHRcdFx0XHRncm91cDogJ2V2Jyxcblx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55XG5cdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0aWQ6IDksXG5cdFx0XHRcdFx0XHR0eXBlOiAnZXZfY2UnLFxuXHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGEuZXZfY2UgLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0dmFsdWU6IHNjb3BlLmNoYXJ0ZGF0YS5ldl9jZSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRuYW1lOiAnQ2xpbWF0ZSBhbmQgRW5lcmd5Jyxcblx0XHRcdFx0XHRcdGdyb3VwOiAnZXYnLFxuXHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnlcblx0XHRcdFx0XHR9XTtcblx0XHRcdFx0XHQvKnNjb3BlLmNoYXJ0ZGF0YS5mb3JFYWNoKChmdW5jdGlvbiAoX3RoaXMpIHtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBub2RlO1xuXHRcdFx0XHRcdFx0XHRub2RlID0ge1xuXHRcdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxuXHRcdFx0XHRcdFx0XHRcdHJhZGl1czogZC52YWx1ZSxcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogZC52YWx1ZSxcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBkLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0b3JnOiAnYmxhJyxcblx0XHRcdFx0XHRcdFx0XHRncm91cDogZC5ncm91cCxcblx0XHRcdFx0XHRcdFx0XHQvL3llYXI6IGQuc3RhcnRfeWVhcixcblx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnlcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIG5vZGVzLnB1c2gobm9kZSk7XG5cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSkodGhpcykpO1xuXHRcdFx0XHRcdHJldHVybiBub2Rlcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYi52YWx1ZSAtIGEudmFsdWU7XG5cdFx0XHRcdFx0fSk7Ki9cblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNyZWF0ZV92aXMgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbSkuaHRtbCgnJyk7XG5cdFx0XHRcdFx0b3B0aW9ucy52aXMgPSBkMy5zZWxlY3QoZWxlbVswXSkuYXBwZW5kKFwic3ZnXCIpLmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKS5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KS5hdHRyKFwiaWRcIiwgXCJzdmdfdmlzXCIpO1xuXHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcyA9IG9wdGlvbnMudmlzLnNlbGVjdEFsbChcImNpcmNsZVwiKS5kYXRhKG5vZGVzLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5pZDtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR2YXIgcGkgPSBNYXRoLlBJO1xuXHRcdFx0XHRcdHZhciBhcmNUb3AgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cygxMDgpXG5cdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTEwKVxuXHRcdFx0XHRcdFx0LnN0YXJ0QW5nbGUoLTkwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHQuZW5kQW5nbGUoOTAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblx0XHRcdFx0XHR2YXIgYXJjQm90dG9tID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoMTIzKVxuXHRcdFx0XHRcdFx0Lm91dGVyUmFkaXVzKDEyNSlcblx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDkwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHQuZW5kQW5nbGUoMjcwICogKHBpIC8gMTgwKSk7IC8vanVzdCByYWRpYW5zXG5cdFx0XHRcdFx0b3B0aW9ucy5hcmNUb3AgPSBvcHRpb25zLnZpcy5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjVG9wKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIFwicmVkXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgxNzAsMTQwKVwiKTtcblxuXHRcdFx0XHRcdG9wdGlvbnMuYXJjQm90dG9tID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyY0JvdHRvbSlcblx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBcInJlZFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMTcwLDE4MClcIik7XG5cdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpLmF0dHIoXCJyXCIsIDApLmF0dHIoXCJmaWxsXCIsIChmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvciB8fCBvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCk7XG5cdFx0XHRcdFx0fSkpLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMCkuYXR0cihcInN0cm9rZVwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZDMucmdiKG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKSkuZGFya2VyKCk7XG5cblx0XHRcdFx0XHR9KS5hdHRyKFwiaWRcIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwiYnViYmxlX1wiICsgZC5pZDtcblx0XHRcdFx0XHR9KS5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc2hvd19kZXRhaWxzKGQsIGksIHRoaXMpO1xuXHRcdFx0XHRcdH0pLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGhpZGVfZGV0YWlscyhkLCBpLCB0aGlzKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5jaXJjbGVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbigyMDAwKS5hdHRyKFwiclwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXM7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciB1cGRhdGVfdmlzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2codHlwZW9mIG9wdGlvbnMuY2lyY2xlcyk7XG5cdFx0XHRcdFx0dmFyIGR1cmF0aW9uID0gMTAwMDtcblx0XHRcdFx0XHRub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKGQsIGkpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcy50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pLmRlbGF5KGkgKiBkdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJyXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNoYXJnZSA9IGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gLU1hdGgucG93KGQucmFkaXVzLCAyLjApIC8gODtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHN0YXJ0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMuZm9yY2UgPSBkMy5sYXlvdXQuZm9yY2UoKS5ub2Rlcyhub2Rlcykuc2l6ZShbb3B0aW9ucy53aWR0aCwgb3B0aW9ucy5oZWlnaHRdKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfZ3JvdXBfYWxsID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5ncmF2aXR5KG9wdGlvbnMubGF5b3V0X2dyYXZpdHkpLmNoYXJnZShjaGFyZ2UpLmZyaWN0aW9uKDAuOSkub24oXCJ0aWNrXCIsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRcdHJldHVybiBvcHRpb25zLmNpcmNsZXMuZWFjaChtb3ZlX3Rvd2FyZHNfY2VudGVyKGUuYWxwaGEpKS5hdHRyKCdjeCcsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueDtcblx0XHRcdFx0XHRcdH0pLmF0dHIoXCJjeVwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0XHQvL3JldHVybiB0aGlzLmhpZGVfeWVhcnMoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfYnlfeWVhciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjkpLm9uKFwidGlja1wiLCAoZnVuY3Rpb24oX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBvcHRpb25zLmNpcmNsZXMuZWFjaChtb3ZlX3Rvd2FyZHNfY2F0KGUuYWxwaGEpKS5hdHRyKFwiY3hcIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdFx0XHRcdH0pLmF0dHIoXCJjeVwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pKHRoaXMpKTtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLnN0YXJ0KCk7XG5cdFx0XHRcdFx0Ly9yZXR1cm4gdGhpcy5kaXNwbGF5X3llYXJzKCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfY2VudGVyID0gZnVuY3Rpb24oYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uKF90aGlzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAob3B0aW9ucy5jZW50ZXIueCAtIGQueCkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhO1xuXHRcdFx0XHRcdFx0XHRkLnkgPSBkLnkgKyAob3B0aW9ucy5jZW50ZXIueSAtIGQueSkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbW92ZV90b3dhcmRzX3RvcCA9IGZ1bmN0aW9uKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbihfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKG9wdGlvbnMuY2VudGVyLnggLSBkLngpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMTtcblx0XHRcdFx0XHRcdFx0ZC55ID0gZC55ICsgKDIwMCAtIGQueSkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4xO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbW92ZV90b3dhcmRzX2NhdCA9IGZ1bmN0aW9uKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbihfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHRhcmdldDtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0ID0gb3B0aW9ucy5jYXRfY2VudGVyc1tkLmdyb3VwXTtcblxuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAodGFyZ2V0LnggLSBkLngpICogKHRhcmdldC5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4xO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55ID0gZC55ICsgKHRhcmdldC55IC0gZC55KSAqICh0YXJnZXQuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0Lyp2YXIgc2hvd19kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHR2YXIgY29udGVudDtcblx0XHRcdFx0XHRkMy5zZWxlY3QoZWxlbWVudCkuYXR0cihcInN0cm9rZVwiLCBcImJsYWNrXCIpO1xuXHRcdFx0XHRcdGNvbnRlbnQgPSBcIjxzcGFuIGNsYXNzPVxcXCJuYW1lXFxcIj5UaXRsZTo8L3NwYW4+PHNwYW4gY2xhc3M9XFxcInZhbHVlXFxcIj4gXCIgKyBkYXRhLm5hbWUgKyBcIjwvc3Bhbj48YnIvPlwiO1xuXHRcdFx0XHRcdGNvbnRlbnQgKz0gXCI8c3BhbiBjbGFzcz1cXFwibmFtZVxcXCI+VmFsdWU6PC9zcGFuPjxzcGFuIGNsYXNzPVxcXCJ2YWx1ZVxcXCI+IFwiICsgKGFkZENvbW1hcyhkYXRhLnZhbHVlKSkgKyBcIjwvc3Bhbj48YnIvPlwiO1xuXHRcdFx0XHRcdGNvbnRlbnQgKz0gXCI8c3BhbiBjbGFzcz1cXFwibmFtZVxcXCI+WWVhcjo8L3NwYW4+PHNwYW4gY2xhc3M9XFxcInZhbHVlXFxcIj4gXCIgKyBkYXRhLnllYXIgKyBcIjwvc3Bhbj5cIjtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy50b29sdGlwLnNob3dUb29sdGlwKGNvbnRlbnQsIGQzLmV2ZW50KTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR2YXIgaGlkZV9kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHRkMy5zZWxlY3QoZWxlbWVudCkuYXR0cihcInN0cm9rZVwiLCAoZnVuY3Rpb24gKF90aGlzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQzLnJnYihvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCkpLmRhcmtlcigpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KSh0aGlzKSk7XG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXHRcdFx0XHR9OyovXG5cblxuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2NoYXJ0ZGF0YScsIGZ1bmN0aW9uKGRhdGEsIG9sZERhdGEpIHtcblx0XHRcdFx0XHRpZiAoZGF0YSA9PT0gb2xkRGF0YSB8fCAhZGF0YSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChvcHRpb25zLmNpcmNsZXMgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0Y3JlYXRlX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfdmlzKCk7XG5cdFx0XHRcdFx0XHRzdGFydCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR1cGRhdGVfdmlzKCk7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLnJlc3VtZSgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGRpc3BsYXlfYnlfeWVhcigpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2RpcmVjdGlvbicsIGZ1bmN0aW9uKG9sZEQsIG5ld0QpIHtcblx0XHRcdFx0XHRpZiAob2xkRCA9PT0gbmV3RCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAob2xkRCA9PSBcImFsbFwiKSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2J5X3llYXIoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnRGF0YUxpc3RpbmdDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2RhdGFMaXN0aW5nJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvZGF0YV9saXN0aW5nL2RhdGFfbGlzdGluZy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdEYXRhTGlzdGluZ0N0cmwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdncmFkaWVudCcsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2dyYWRpZW50L2dyYWRpZW50Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0dyYWRpZW50Q3RybCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdHcmFkaWVudEN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbnN1cHBvcnRlZEJyb3dzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==