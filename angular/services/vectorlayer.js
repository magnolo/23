(function() {
	"use strict";

	angular.module('app.services').factory('VectorlayerService', function($timeout) {
		var that = this, _self = this;
		return {
			canvas: false,
			palette: [],
			ctx: '',
			keys: {
				mazpen: 'vector-tiles-Q3_Os5w',
				mapbox: 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ'
			},
<<<<<<< HEAD
			data: {
				layer: '',
				name: 'countries_big',
				baseColor: '#06a99c',
				iso3: 'adm0_a3',
				iso2: 'iso_a2',
				iso: 'iso_a2',
				fields: "id,admin,adm0_a3,wb_a3,su_a3,iso_a3,iso_a2,name,name_long",
				field:'score'
			},
			map: {
				data: [],
				current: [],
				structure: [],
				style: []
			},
			mapLayer: null,
			setMap: function(map){
				return this.mapLayer = map;
			},
			setLayer: function(l) {
				return this.data.layer = l;
			},
			getLayer: function() {
				return this.data.layer;
			},
			getName: function() {
				return this.data.name;
			},
			fields: function() {
				return this.data.fields;
			},
			iso: function() {
				return this.data.iso;
			},
			iso3: function() {
				return this.data.iso3;
			},
			iso2: function() {
				return this.data.iso2;
			},
			createCanvas: function(color) {
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
			},
			updateCanvas: function(color) {
				var gradient = this.ctx.createLinearGradient(0, 0, 280, 10);
				gradient.addColorStop(1, 'rgba(255,255,255,0)');
				gradient.addColorStop(0.53, color || 'rgba(128, 243, 198,1)');
				gradient.addColorStop(0, 'rgba(102,102,102,1)');
				this.ctx.fillStyle = gradient;
				this.ctx.fillRect(0, 0, 280, 10);
				this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
				//document.getElementsByTagName('body')[0].appendChild(this.canvas);
			},
			createFixedCanvas: function(colorRange){
=======
			northEast: {
				lat: -90,
				lng: -180
			}
		};
		this.defaults = {
			minZoom: 2,
			maxZoom: 6,
			zoomControlPosition:'bottomright'
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
					detectRetina: true,
					// attribution:basemap.attribution || basemap.provider,
					attribution: "Copyright:© 2014 Esri, DeLorme, HERE, TomTom"
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
					colors: ['#fff', style.base_color, 'rgba(102,102,102,1)'],
					labels: ['high', 'Ø', 'low']
				}
			} else {
				this.legend = {}
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
>>>>>>> master

				this.canvas = document.createElement('canvas');
				this.canvas.width = 280;
				this.canvas.height = 10;
				this.ctx = this.canvas.getContext('2d');
				var gradient = this.ctx.createLinearGradient(0, 0, 280, 10);

				for(var i = 0; i < colorRange.length; i++){
					gradient.addColorStop(1 / (colorRange.length -1) * i, colorRange[i]);
				}
				this.ctx.fillStyle = gradient;
				this.ctx.fillRect(0, 0, 280, 10);
				this.palette = this.ctx.getImageData(0, 0, 257, 1).data;

			},
			updateFixedCanvas: function(colorRange) {
				var gradient = this.ctx.createLinearGradient(0, 0, 280, 10);
				for(var i = 0; i < colorRange.length; i++){
					gradient.addColorStop(1 / (colorRange.length -1) * i, colorRange[i]);
				}
				this.ctx.fillStyle = gradient;
				this.ctx.fillRect(0, 0, 280, 10);
				this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
				//document.getElementsByTagName('body')[0].appendChild(this.canvas);
			},
			setBaseColor: function(color) {
				return this.data.baseColor = color;
			},
		/*	setStyle: function(style) {
				this.data.layer.setStyle(style)
			},*/
			countryClick: function(clickFunction) {
				var that = this;
				$timeout(function(){
						that.data.layer.options.onClick = clickFunction;
				})

			},
			getColor: function(value) {
				return this.palette[value];
			},
			setStyle: function(style){
				return this.map.style = style;
			},
			setData: function(data, color, drawIt) {
				this.map.data = data;
				if (typeof color != "undefined") {
					this.data.baseColor = color;
				}
				if (!this.canvas) {
					if(typeof this.data.baseColor == 'string'){
						this.createCanvas(this.data.baseColor);
					}
					else{
						this.createFixedCanvas(this.data.baseColor);
					}
				} else {
					if(typeof this.data.baseColor == 'string'){
						this.updateCanvas(this.data.baseColor);
					}
					else{
						this.updateFixedCanvas(this.data.baseColor);
					}
				}
				if (drawIt) {
					this.paintCountries();
				}
			},
			getNationByIso: function(iso, list) {
				if(typeof list !== "undefined"){
					if (list.length == 0) return false;
					var nation = {};
					angular.forEach(list, function(nat) {
						if (nat.iso == iso) {
							nation = nat;
						}
					});
				}
				else{
					if (this.map.data.length == 0) return false;
					var nation = {};
					angular.forEach(this.map.data, function(nat) {
						if (nat.iso == iso) {
							nation = nat;
						}
					});
				}
				return nation;
			},
			getNationByName: function(name) {
				if (this.map.data.length == 0) return false;
			},
			paintCountries: function(style, click, mutex) {
				var that = this;

				$timeout(function() {
					if (typeof style != "undefined" && style != null) {
						that.data.layer.setStyle(style);
					} else {
						that.data.layer.setStyle(that.map.style);
					}
<<<<<<< HEAD
					if (typeof click != "undefined") {
						that.data.layer.options.onClick = click
					}
					that.data.layer.redraw();
=======

				});
				this.redraw();
			}

		}
		this.setSelectedFeature = function(iso, selected, deselectedAll) {

			if (typeof this.data.layer.layers[this.data.name + '_geom'].features[iso] == 'undefined') {
				console.log(iso);
				//debugger;
			} else {
				if(deselectedAll){
					angular.forEach(this.data.layer.layers[this.data.name + '_geom'].features, function(feature, key) {
							feature.selected = false;

					});
				}

				this.data.layer.layers[this.data.name + '_geom'].features[iso].selected = selected;
				this.redraw();
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
>>>>>>> master
				});
			},
			resetSelected: function(iso){
				if(typeof this.data.layer.layers != "undefined"){
					angular.forEach(this.data.layer.layers[this.data.name+'_geom'].features, function(feature, key){
						if(iso){
							if(key != iso)
								feature.selected = false;
						}
						else{
							feature.selected = false;
						}

					});
					this.redraw();
				}

			},
			setSelectedFeature:function(iso, selected){
				if(typeof this.data.layer.layers[this.data.name+'_geom'].features[iso] == 'undefined'){
					console.log(iso);
					//debugger;
				}
				else{
					this.data.layer.layers[this.data.name+'_geom'].features[iso].selected = selected;
				}

			},
			redraw:function(){
				this.data.layer.redraw();
			},
			//FULL TO DO
			countriesStyle: function(feature) {
				debugger;
				var style = {};
				var iso = feature.properties[that.data.iso2];
				var nation = that.getNationByIso(iso);
				var field = that.data.field;
				var type = feature.type;
				feature.selected = false;

				switch (type) {
					case 3: //'Polygon'
						if (typeof nation[field] != "undefined" && nation[field] != null){
							var linearScale = d3.scale.linear().domain([vm.range.min,vm.range.max]).range([0,256]);

							var colorPos =  parseInt(linearScale(parseFloat(nation[field]))) * 4;// parseInt(256 / vm.range.max * parseInt(nation[field])) * 4;
							console.log(colorPos, iso,nation);
							var color = 'rgba(' + that.palette[colorPos] + ', ' + that.palette[colorPos + 1] + ', ' + that.palette[colorPos + 2] + ',' + that.palette[colorPos + 3] + ')';
							style.color = 'rgba(' + that.palette[colorPos] + ', ' + that.palette[colorPos + 1] + ', ' + that.palette[colorPos + 2] + ',0.6)'; //color;
							style.outline = {
								color: color,
								size: 1
							};
							style.selected = {
								color: 'rgba(' + that.palette[colorPos] + ', ' + that.palette[colorPos + 1] + ', ' + that.palette[colorPos + 2] + ',0.3)',
								outline: {
									color: 'rgba(66,66,66,0.9)',
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

		}
	});

})();
