(function(){
    "use strict";

    angular.module('app.services').factory('VectorlayerService', function(){

        return{
          canvas : '',
          palette: [],
          ctx: '',
          keys:{
            mazpen:'vector-tiles-Q3_Os5w',
            mapbox:'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ'
          },
          data:{
            layer: '',
            name:'countries_big',
            iso3:'adm0_a3',
            iso2:'iso_a2',
            iso:'iso_a2',
            fields: "id,admin,adm0_a3,wb_a3,su_a3,iso_a3,iso_a2,name,name_long"
          },
          setLayer: function(l){
            return this.data.layer = l;
          },
          getLayer: function(){
            return this.data.layer;
          },
          getName: function(){
            return this.data.name;
          },
          fields: function() {
            return this.data.fields;
          },
          iso:function(){
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
      			gradient.addColorStop(0.53, color ||  'rgba(128, 243, 198,1)');
      			gradient.addColorStop(0, 'rgba(102,102,102,1)');
      			this.ctx.fillStyle = gradient;
      			this.ctx.fillRect(0, 0, 280, 10);
      			this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
      			//document.getElementsByTagName('body')[0].appendChild(this.canvas);
      		},
      		updateCanvas:function(color) {
      			var gradient = this.ctx.createLinearGradient(0, 0, 280, 10);
      			gradient.addColorStop(1, 'rgba(255,255,255,0)');
      			gradient.addColorStop(0.53, color || 'rgba(128, 243, 198,1)' );
      			gradient.addColorStop(0, 'rgba(102,102,102,1)');
      			this.ctx.fillStyle = gradient;
      			this.ctx.fillRect(0, 0, 280, 10);
      			this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
      			//document.getElementsByTagName('body')[0].appendChild(vm.canvas);
      		},
          getColor: function(value){
            return this.palette[value];
          }


        }
    });

})();
