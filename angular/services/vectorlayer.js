(function() {
	"use strict";

	angular.module('app.services').service('VectorlayerService', function($timeout, DataService, leafletData) {
		var that = this,
			_self = this;
		/**
		 * Basemap die verwendet wird, falls von Style oder aehnlichem keine eigene Basemap mitreinkommt.
		 * Ist allgemein ein Angular-Leaflet Config-Objekt
		 * @type {{name: string, url: string, type: string, layerOptions: {noWrap: boolean, continuousWorld: boolean, detectRetina: boolean}}}
         */
		this.fallbackBasemap = {
			name: 'Outdoor',
			url: 'https://{s}.tiles.mapbox.com/v4/valderrama.d86114b6/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ',
			type: 'xyz',

			options: {
				noWrap: true,
				continuousWorld: false,
				detectRetina: true,

			}
		}
		/**
		 * this.basemap ist die map die gerendert wird
		 * @type {{name: string, url: string, type: string, layerOptions: {noWrap: boolean, continuousWorld: boolean, detectRetina: boolean}}|*}
         */
		this.basemap = this.fallbackBasemap;
		this.iso_field = 'iso_a2';
		//Ob canvas schon instatiert ist
		this.canvas = false;
		//Ist ein Farbverlauf anhand dessen die Farben selektiert werden um Polygone der Länder einzufärben
		this.palette = [];
		//Context der im Canvas erstellt wird, auf dem gezeichnet werden kann
		this.ctx = null;
		//API Keys
		this.keys = {
			mazpen: 'vector-tiles-Q3_Os5w',
			mapbox: 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ'
		};
		//Configuration fuer den Datenzugriff allgemein
		this.data = {
			layer: '',
			//Tabellenname in der die Laendershapes liegen
			name: 'countries_big',
			//Default Farbe
			baseColor: '#06a99c',
			//ISO-3 Code Spalte
			iso3: 'adm0_a3',
			//ISO-2 Code Spalte
			iso2: 'iso_a2',
			//ISO Code der tatsaechlich verwendet wird
			iso: 'iso_a2',
			//Felder die aus der Datenbank angefordert werden auf die Landershapes bezogen
			fields: "id,admin,adm0_a3,wb_a3,su_a3,iso_a3,iso_a2,name,name_long",
			//Name des Feldes mit dem abgeglichen wird
			field: 'score'
		};
		// <DEPRECEATED>
		this.map = {
			data: [],
			current: [],
			structure: [],
			style: [],
			attribution:''
		};
		// Object - Hier wird der Vektorlayer abgespeichert
		this.mapLayer = null;
		//Leaflet Configuration für Layers
		this.layers = {
			baselayers: {
				xyz:this.basemap,
			}
		};
		// Leaflet Config: Center
		this.center = {
			lat: 48.209206,
			lng: 16.372778,
			zoom: 3
		};
		//Leaflet Config: Grenzen
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
		//Leaflet Config: Default Einstellungen
		this.defaults = {
			minZoom: 2,
			maxZoom: 6,
			zoomControlPosition:'bottomright'
		};
		//Leafet Config: Lengende in der Map
		this.legend = null;
		this.setMap = function(map) {
			return this.mapLayer = map;
		}
		this.getMap = function() {
			return this.mapLayer;
		}
		//Legt die gewünschte Basemap von Leaflet fest. Falls nichts vorhanden, wird die FallbackMap verwendet
		this.setBaseLayer = function(basemap, dataprovider) {
			if (!basemap)
				this.basemap = basemap = this.fallbackBasemap;
			var attribution = (basemap.attribution || basemap.provider);
			if(dataprovider){
				attribution += ' | Data by <a href="'+dataprovider.url+'" target="_blank">' + dataprovider.title + '</a>';
			}
			this.layers.baselayers['xyz'] = {
				name: basemap.name,
				url: basemap.url,
				type: 'xyz',
				// options: {
				// 	noWrap: true,
				// 	continuousWorld: false,
				// 	detectRetina: true,
				// 	attribution:attribution,
				// }

			}
			this.map.attribution = attribution;
		// 	//DIRTY HACK TO CORRECT LAYER ON TOP: SETTING OPTIONS UP HERE CAUSES THE PROBLEM
		//  $timeout(function(){
		// 	 angular.forEach(that.mapLayer._layers,function(layer){
		// 		 if(layer.options.url != "https://www.23degree.org:3001/services/postgis/countries_big/geom/vector-tiles/{z}/{x}/{y}.pbf?fields=id,admin,adm0_a3,wb_a3,su_a3,iso_a3,iso_a2,name,name_long" ){
		// 				layer.bringToBack();
		// 		 }
		 //
		// 	 })
		//  })
		}
		//Legt die Einstellungen für die Map fest, falls andere Standardwerte gewünscht sind
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
				if(style.color_range){
					this.legend = {
						colors: [],
						labels: []
					}
					if(typeof style.color_range == "string"){
						style.color_range = JSON.parse(style.color_range);
					}
					angular.forEach(style.color_range, function(color){
						if(color.hasLabel){
							that.legend.colors.push(color.color);
							if(color.label){
								that.legend.labels.push(color.label);
							}
							else{
								that.legend.labels.push(parseFloat(color.stop*100).toFixed(0));
							}

						}

					});
					if(this.legend.colors.length == 0){
						this.legend = null;
					}
				}
				else{
					this.legend = {
						colors: ['#fff', style.base_color, 'rgba(102,102,102,1)'],
						labels: ['high', 'Ø', 'low']
					}
				}

			} else {
				this.legend = null
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
		//Erstellt das Canvas element fuer den monochromen Gradient aus dem die Palette genommen wird
		this.createCanvas = function(color) {
			//Erstellt canvas DOM-Element
			this.canvas = document.createElement('canvas');
			//Dimensionen des canvas elements
			this.canvas.width = 257;
			this.canvas.height = 10;
			//2d Context auf dem gemalt werden kann
			this.ctx = this.canvas.getContext('2d');
			//Erstellt Gradient, noch nicht gezeichnet
			var gradient = this.ctx.createLinearGradient(0, 0, 257, 10);
			//Legt Position und Farbwert im Gradient fest
			gradient.addColorStop(1, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.53, color || 'rgba(128, 243, 198,1)');
			gradient.addColorStop(0, 'rgba(102,102,102,1)');
			//Zeichnet Gradient in 2d context
			this.ctx.fillStyle = gradient;
			this.ctx.fillRect(0, 0, 257, 10);
			//Liste der RGB(vllt A) Daten die in den Gradient gezeichnet wurden
			this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
			//document.getElementsByTagName('body')[0].appendChild(this.canvas);
		}
		//Siehe oben
		this.updateCanvas = function(color) {


			var gradient = this.ctx.createLinearGradient(0, 0, 257, 10);
			gradient.addColorStop(1, 'rgba(255,255,255,0.6)');
			gradient.addColorStop(0.53, color || 'rgba(128, 243, 198,0.6)');
			gradient.addColorStop(0, 'rgba(102,102,102,.6)');

			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.fillStyle = gradient;
			this.ctx.fillRect(0, 0, 257, 10);

			this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
		}
		//Wie oben, nur das eine Farbpalette mit gegeben wird, daher polychrom
		this.createFixedCanvas = function(colorRange) {

			this.canvas = document.createElement('canvas');
			this.canvas.width = 257;
			this.canvas.height = 10;
			this.ctx = this.canvas.getContext('2d');
			var gradient = this.ctx.createLinearGradient(0, 0, 257, 10);

			for (var i = 0; i < colorRange.length; i++) {
				gradient.addColorStop(colorRange[i].stop, colorRange[i].color);
			}
			this.ctx.fillStyle = gradient;
			this.ctx.fillRect(0, 0, 257, 10);
			this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
		}
		this.updateFixedCanvas = function(colorRange) {
			var gradient = this.ctx.createLinearGradient(0, 0, 257, 10);
			for (var i = 0; i < colorRange.length; i++) {
					gradient.addColorStop(colorRange[i].stop, colorRange[i].color);
			}
			this.ctx.clearRect(0, 0, 257,10);
			this.ctx.fillStyle = gradient;
			this.ctx.fillRect(0, 0, 257, 10);
			this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
			//document.getElementsByTagName('body')[0].appendChild(this.canvas);
		}
		this.setBaseColor = function(color) {
			return this.data.baseColor = color;
		}
		//Was passiert wenn auf ein Land/Polygon geclickt wird
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
		//Legt den Style der Vectormap fest, welche zB für die Anzeige vom Ländervergleich verwendet wird. Rendert nur ausgewählte Features
		this.invertStyle = function() {
			this.data.layer.setStyle(that.invertedStyle);
			that.data.layer.options.mutexToggle = false;
			that.data.layer.redraw();
		}
		//Legt den default Style der Vectormap fest
		this.localStyle = function() {
			this.data.layer.setStyle(that.countriesStyle);
			that.data.layer.options.mutexToggle = true;
			that.data.layer.redraw();
		}
		//Legt Daten und Struktur des darzustellenden Index fest, setzt die Basecolor und rendert den Layer
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
		//Wenn $digest fertig, wird der Style der Vectormap festgelegt, eventuell 
		// die ClickFunktion auf den Länder/Polygoenn
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
		//Wenn ein iso Wert als Parameter mitgegeben wird, wird allen anderen Länder 
		// der selected wert auf false gesetzt, sonst passiert das selbe bei allen Lüänern
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
		//Setzt die select Property eines Landes auf den true/false (selected) 
		// und auf wunsch (deselectedAll = true) bei allen anderen Ländern/Polygonen auf false
		this.setSelectedFeature = function(iso, selected, deselectAll) {
			//Wenn das angeklickte Feature der Map keinen Iso-Wert enthält, soll nichts passieren
			if (typeof this.data.layer.layers[this.data.name + '_geom'].features[iso] == 'undefined') {
				console.log(iso);
				//debugger;
			} else {
				if(deselectAll){
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
			if(typeof color == "string"){
				this.setBaseColor(color);
				if (this.ctx) {
					this.updateCanvas(color);
				} else {
					this.createCanvas(color)
				}
			}
			else{
				if (this.ctx) {
					this.updateFixedCanvas(color);
				} else {
					this.createFixedCanvas(color)
				}
			}

			this.paintCountries();
		}
		// Zoom der Map zu den gewünschte Land
		this.gotoCountry = function(iso) {
			DataService.getOne('countries/bbox', [iso]).then(function(data) {
				var southWest = L.latLng(data.coordinates[0][0][1], data.coordinates[0][0][0]),
					northEast = L.latLng(data.coordinates[0][2][1], data.coordinates[0][2][0]),
					bounds = L.latLngBounds(southWest, northEast);

				var pad = [
					[0, 0],
					[100, 100]
				];
				that.mapLayer.fitBounds(bounds, {
					padding: pad[1],
					maxZoom: 4
				});
			});
		}
		// Zoom der Map zu den gewünschten Ländern
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
				that.mapLayer.fitBounds(bounds, {
					padding: pad[1],
					maxZoom: 4
				});
			});
		}
		
		//LE
		//Style Function des Vectorlayers. Feature ist da angeklickte Land/Polygon 
		// mit den angeforderten Felders als Properties > this.data.fields
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
						var color = 'rgba(' + that.palette[colorPos] + ', ' + that.palette[colorPos + 1] + ', ' + that.palette[colorPos + 2] + ',' + (that.palette[colorPos + 3]/255) + ')';
						style.color = color;// 'rgba(' + that.palette[colorPos] + ', ' + that.palette[colorPos + 1] + ', ' + that.palette[colorPos + 2] + ',0.6)'; //color;
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
