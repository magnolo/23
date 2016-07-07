(function() {
	"use strict";

	angular.module('app.services').service('VectorlayerService', function($timeout, DataService) {
		var that = this,
			_self = this;
		this.fallbackBasemap = {
			name: 'Outdoor',
			url: 'https://{s}.tiles.mapbox.com/v4/valderrama.d86114b6/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ',
			type: 'xyz',
			layerOptions: {
				noWrap: true,
				continuousWorld: false,
				detectRetina: true
			}
		}
		this.basemap = this.fallbackBasemap;
		this.iso_field = 'iso_a2';
		this.canvas = false;
		this.palette = [];
		this.ctx = null;
		this.keys = {
			mazpen: 'vector-tiles-Q3_Os5w',
			mapbox: 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ'
		};
		this.data = {
			layer: '',
			name: 'countries_big',
			baseColor: '#06a99c',
			iso3: 'adm0_a3',
			iso2: 'iso_a2',
			iso: 'iso_a2',
			fields: "id,admin,adm0_a3,wb_a3,su_a3,iso_a3,iso_a2,name,name_long",
			field: 'score'
		};
		this.map = {
			data: [],
			current: [],
			structure: [],
			style: []
		};
		this.mapLayer = null;
		this.layers = {
			baselayers: {
				xyz: this.basemap
			}
		};
		this.center = {
			lat: 48.209206,
			lng: 16.372778,
			zoom: 3
		};
		this.maxbounds = {
			southWest: {
				lat: 90,
				lng: 180
			},
			northEast: {
				lat: -90,
				lng: -180
			}
		};
		this.defaults = {
			minZoom: 2,
			maxZoom: 6
		};
		this.legend = {};
		this.setMap = function(map) {
			return this.mapLayer = map;
		}
		this.getMap = function() {
			return this.mapLayer;
		}
		this.setBaseLayer = function(basemap) {
			if (!basemap)
				this.basemap = basemap = this.fallbackBasemap;
			this.layers.baselayers['xyz'] = {
				name: basemap.name,
				url: basemap.url,
				type: 'xyz',
				layerOptions: {
					noWrap: true,
					continuousWorld: false,
					detectRetina: true
				}
			}
		}
		this.setMapDefaults = function(style) {
			this.defaults = {
				zoomControl: style.zoom_controls,
				scrollWheelZoom: style.scroll_wheel_zoom
			}
			if (style.scroll_wheel_zoom) {
				this.mapLayer.scrollWheelZoom.enable()
			} else {
				this.mapLayer.scrollWheelZoom.disable()
			}
			if (style.legends) {
				this.legend = {
					colors: [],

				}
			}

		}
		this.resetBaseLayer = function() {
			this.layers.baselayers['xyz'] = this.baselayer;
		}
		this.setLayer = function(l) {
			return this.data.layer = l;
		}
		this.getLayer = function() {
			return this.data.layer;
		}
		this.getName = function() {
			return this.data.name;
		}
		this.fields = function() {
			return this.data.fields;
		}
		this.iso = function() {
			return this.data.iso;
		}
		this.iso3 = function() {
			return this.data.iso3;
		}
		this.iso2 = function() {
			return this.data.iso2;
		}
		this.createCanvas = function(color) {
			this.canvas = document.createElement('canvas');
			this.canvas.width = 280;
			this.canvas.height = 10;
			this.ctx = this.canvas.getContext('2d');
			var gradient = this.ctx.createLinearGradient(0, 0, 280, 10);
			gradient.addColorStop(1, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.53, color || 'rgba(128, 243, 198,1)');
			gradient.addColorStop(0, 'rgba(102,102,102,1)');
			this.ctx.fillStyle = gradient;
			this.ctx.fillRect(0, 0, 280, 10);
			this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
			//document.getElementsByTagName('body')[0].appendChild(this.canvas);
		}
		this.updateCanvas = function(color) {

			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			var gradient = this.ctx.createLinearGradient(0, 0, 257, 10);
			gradient.addColorStop(1, 'rgba(255,255,255,1)');
			gradient.addColorStop(0.53, color || 'rgba(128, 243, 198,1)');
			gradient.addColorStop(0, 'rgba(102,102,102,1)');
			this.ctx.fillStyle = gradient;
			this.ctx.fillRect(0, 0, 257, 10);
			this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
			//document.getElementsByTagName('body')[0].appendChild(this.canvas);
		}
		this.createFixedCanvas = function(colorRange) {

			this.canvas = document.createElement('canvas');
			this.canvas.width = 280;
			this.canvas.height = 10;
			this.ctx = this.canvas.getContext('2d');
			var gradient = this.ctx.createLinearGradient(0, 0, 257, 10);

			for (var i = 0; i < colorRange.length; i++) {
				gradient.addColorStop(1 / (colorRange.length - 1) * i, colorRange[i]);
			}
			this.ctx.fillStyle = gradient;
			this.ctx.fillRect(0, 0, 257, 10);
			this.palette = this.ctx.getImageData(0, 0, 257, 1).data;

		}
		this.updateFixedCanvas = function(colorRange) {
			var gradient = this.ctx.createLinearGradient(0, 0, 257, 10);
			for (var i = 0; i < colorRange.length; i++) {
				gradient.addColorStop(1 / (colorRange.length - 1) * i, colorRange[i]);
			}
			this.ctx.fillStyle = gradient;
			this.ctx.fillRect(0, 0, 257, 10);
			this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
			//document.getElementsByTagName('body')[0].appendChild(this.canvas);
		}
		this.setBaseColor = function(color) {
				return this.data.baseColor = color;
			}
			/*	setStyle: function(style) {
					this.data.layer.setStyle(style)
				},*/
		this.countryClick = function(clickFunction) {
			var that = this;
			$timeout(function() {
				that.data.layer.options.onClick = clickFunction;
			});

		}
		this.getColor = function(value) {
			return this.palette[value];
		}
		this.setStyle = function(style) {
			return this.map.style = style;
		}
		this.invertStyle = function() {
			this.data.layer.setStyle(that.invertedStyle);
			that.data.layer.options.mutexToggle = false;
			that.data.layer.redraw();
		}
		this.localStyle = function() {
			this.data.layer.setStyle(that.countriesStyle);
			that.data.layer.options.mutexToggle = true;
			that.data.layer.redraw();
		}
		this.setData = function(data, structure, color, drawIt) {
			this.map.data = data;
			this.map.structure = structure;
			if (typeof color != "undefined") {
				this.data.baseColor = color;
			}
			if (!this.canvas) {
				if (typeof this.data.baseColor == 'string') {
					this.createCanvas(this.data.baseColor);
				} else {
					this.createFixedCanvas(this.data.baseColor);
				}
			} else {
				if (typeof this.data.baseColor == 'string') {
					this.updateCanvas(this.data.baseColor);
				} else {
					this.updateFixedCanvas(this.data.baseColor);
				}
			}
			if (drawIt) {
				this.paintCountries();
			}
		}
		this.getNationByIso = function(iso, list) {
			if (typeof list !== "undefined") {
				if (list.length == 0) return false;
				var nation = {};
				angular.forEach(list, function(nat) {
					if (nat.iso == iso) {
						nation = nat;
					}
				});
			} else {
				if (this.map.data.length == 0) return false;
				var nation = {};
				angular.forEach(this.map.data, function(nat) {
					if (nat.iso == iso) {
						nation = nat;
					}
				});
			}
			return nation;
		}
		this.getNationByName = function(name) {
			if (this.map.data.length == 0) return false;
		}
		this.paintCountries = function(style, click, mutex) {
			var that = this;

			$timeout(function() {
				if (typeof style != "undefined" && style != null) {
					that.data.layer.setStyle(style);
				} else {
					//that.data.layer.setStyle(that.map.style);
					that.data.layer.setStyle(that.countriesStyle);
				}
				if (typeof click != "undefined") {
					that.data.layer.options.onClick = click
				}
				that.data.layer.redraw();
			});
		}
		this.resetSelected = function(iso) {
			if (typeof this.data.layer.layers != "undefined") {
				angular.forEach(this.data.layer.layers[this.data.name + '_geom'].features, function(feature, key) {
					if (iso) {
						if (key != iso)
							feature.selected = false;
					} else {
						feature.selected = false;
					}

				});
				this.redraw();
			}

		}
		this.setSelectedFeature = function(iso, selected) {

			if (typeof this.data.layer.layers[this.data.name + '_geom'].features[iso] == 'undefined') {
				console.log(iso);
				//debugger;
			} else {
				this.data.layer.layers[this.data.name + '_geom'].features[iso].selected = selected;
			}

		}
		this.redraw = function() {
			this.data.layer.redraw();
		}
		this.paint = function(color) {
			this.setBaseColor(color);
			if (this.ctx) {
				this.updateCanvas(color);
			} else {
				this.createCanvas(color)
			}
			this.paintCountries();
		}
		this.gotoCountry = function(iso) {
			DataService.getOne('countries/bbox', [iso]).then(function(data) {
				var southWest = L.latLng(data.coordinates[0][0][1], data.coordinates[0][0][0]),
					northEast = L.latLng(data.coordinates[0][2][1], data.coordinates[0][2][0]),
					bounds = L.latLngBounds(southWest, northEast);

				var pad = [
					[0, 0],
					[100, 100]
				];
				// if (vm.compare.active) {
				// 	pad = [
				// 		[0, 0],
				// 		[0, 0]
				// 	];
				// }
				that.mapLayer.fitBounds(bounds, {
					padding: pad[1],
					maxZoom: 4
				});
			});
		}
		this.gotoCountries = function(main, isos) {
				//	isos.push(main);
				DataService.getOne('countries/bbox', isos).then(function(data) {
					var southWest = L.latLng(data.coordinates[0][0][1], data.coordinates[0][0][0]),
						northEast = L.latLng(data.coordinates[0][2][1], data.coordinates[0][2][0]),
						bounds = L.latLngBounds(southWest, northEast);

					var pad = [
						[100, 100],
						[100, 100]
					];
					// if (vm.compare.active) {
					// 	pad = [
					// 		[0, 0],
					// 		[0, 0]
					// 	];
					// }
					that.mapLayer.fitBounds(bounds, {
						padding: pad[1],
						maxZoom: 4
					});
				});
			}
			//FULL TO DO
		this.countriesStyle = function(feature) {

			var style = {};
			var iso = feature.properties[that.iso_field];
			var nation = that.getNationByIso(iso);
			var field = 'score';
			var type = feature.type;
			feature.selected = false;
			switch (type) {
				case 3: //'Polygon'
					if (typeof nation[field] != "undefined" && nation[field] != null) {
						var linearScale = d3.scale.linear().domain([that.map.structure.min, that.map.structure.max]).range([0, 256]);

						var colorPos = parseInt(linearScale(parseFloat(nation[field]))) * 4; //;
						//var colorPos = parseInt(256 / 100 * parseInt(nation[field])) * 4;
						var color = 'rgba(' + that.palette[colorPos] + ', ' + that.palette[colorPos + 1] + ', ' + that.palette[colorPos + 2] + ',' + that.palette[colorPos + 3] + ')';

						style.color = 'rgba(' + that.palette[colorPos] + ', ' + that.palette[colorPos + 1] + ', ' + that.palette[colorPos + 2] + ',0.6)'; //color;
						style.outline = {
							color: color,
							size: 1
						};
						style.selected = {
							color: 'rgba(' + that.palette[colorPos] + ', ' + that.palette[colorPos + 1] + ', ' + that.palette[colorPos + 2] + ',0.3)',
							outline: {
								color: 'rgba(' + that.palette[colorPos] + ', ' + that.palette[colorPos + 1] + ', ' + that.palette[colorPos + 2] + ',1)',
								// color: 'rgba(66,66,66,0.9)',
								size: 2
							}
						};

					} else {
						style.color = 'rgba(255,255,255,0)';
						style.outline = {
							color: 'rgba(255,255,255,0)',
							size: 1
						};

					}
					break;
			}
			return style;
		}
		this.invertedStyle = function(feature) {
			var style = {};
			var iso = feature.properties[that.iso_field];
			var nation = that.getNationByIso(iso);
			// var field = that.map.structure.name || 'score';
			var field = 'score';

			var linearScale = d3.scale.linear().domain([that.map.structure.min, that.map.structure.max]).range([0, 256]);
			var colorPos = parseInt(linearScale(parseFloat(nation[field]))) * 4; //;
			var color = 'rgba(' + that.palette[colorPos] + ', ' + that.palette[colorPos + 1] + ', ' + that.palette[colorPos + 2] + ',' + that.palette[colorPos + 3] + ')';

			style.color = 'rgba(0,0,0,0)';
			if (typeof nation[field] != "undefined" && nation[field] != null) {
				style.color = 'rgba(' + that.palette[colorPos] + ', ' + that.palette[colorPos + 1] + ', ' + that.palette[colorPos + 2] + ',0.1)';
			}

			style.outline = {
				color: 'rgba(0,0,0,0)',
				size: 0
			};
			style.selected = {
				color: color,
				outline: {
					color: 'rgba(0,0,0,0.3)',
					size: 2
				}
			};
			return style;
		}

	});

})();
