(function () {
	"use strict";

	function CustomTooltip(tooltipId, width) {
		var tooltipId = tooltipId;
		angular.element(document).find('body').append("<div class='tooltip md-whiteframe-z3' id='" + tooltipId + "'></div>");

		/*if (width) {
		  //$("#" + tooltipId).css("width", width);
		}*/

		hideTooltip();

		function showTooltip(content, data, event) {
			angular.element(document.querySelector('#' + tooltipId)).html(content);
			angular.element(document.querySelector('#' + tooltipId)).css('display', 'block');

			return updatePosition(event, data);
		}

		function hideTooltip() {
			angular.element(document.querySelector('#' + tooltipId)).css('display', 'none');
		}

		function updatePosition(event, d) {
			var ttid = "#" + tooltipId;
			var xOffset = 20;
			var yOffset = 10;
			var svg = document.querySelector('#svg_vis');
			var wscrY = window.scrollY;
			var ttw = angular.element(document.querySelector(ttid)).offsetWidth;
			var tth = document.querySelector(ttid).offsetHeight;
			var tttop = svg.getBoundingClientRect().top + d.y - tth / 2;
			var ttleft = svg.getBoundingClientRect().left + d.x + d.radius + 12;
			return angular.element(document.querySelector(ttid)).css('top', tttop + 'px').css('left', ttleft + 'px');
		}

		return {
			showTooltip: showTooltip,
			hideTooltip: hideTooltip,
			updatePosition: updatePosition
		}
	}
	angular.module('app.directives').directive('bubbles', function ($compile) {
		var defaults;
		defaults = function () {
			return {
				width: 940,
				height: 600,
				layout_gravity: 0,
				vis: null,
				force: null,
				damper: 0.1,
				circles: null,
				fill_color: d3.scale.ordinal().domain(["eh", "ev"]).range(["#a31031", "#beccae"]),
				max_amount: '',
				radius_scale: '',
				duration: 1000,
				tooltip: CustomTooltip("bubbles_tooltip", 240)
			};
		};
		return {
			restrict: 'E',
			//controller: 'BubblesCtrl',
			scope: {
				chartdata: '=',
				direction: '=',
				gravity: '=',
				sizefactor: '='
			},
			link: function (scope, elem, attrs) {
				var options = angular.extend(defaults(), attrs);
				var nodes = [],
					links = [];

				var max_amount = d3.max(scope.chartdata, function (d) {
					return parseInt(d.value);
				});

				options.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85]);
				options.center = {
					x: options.width / 2,
					y: options.height / 2
				};
				options.cat_centers = {
					"eh": {
						x: options.width / 2,
						y: options.height / 100 * 45,
						damper: 0.085
					},
					"ev": {
						x: options.width / 2,
						y: options.height / 100 * 55,
						damper: 0.085
					}
				};
				var create_nodes = function () {
					nodes = [{
						id: 1,
						type: 'eh_hi',
						radius: scope.chartdata.eh_hi / scope.sizefactor,
						value: scope.chartdata.eh_hi / scope.sizefactor,
						name: 'Health Impact',
						group: 'eh',
						x: options.center.x,
						y: options.center.y,
						color: '#ff9600',
						icon: 'man',
						unicode: '\ue605'
					}, {
						id: 2,
						type: 'eh_aq',
						radius: scope.chartdata.eh_aq / scope.sizefactor,
						value: scope.chartdata.eh_aq / scope.sizefactor,
						name: 'Air Quality',
						group: 'eh',
						x: options.center.x,
						y: options.center.y,
						color: '#f7c80b',
						icon: 'sink',
						unicode: '\ue606'
					}, {
						id: 3,
						type: 'eh_ws',
						radius: scope.chartdata.eh_ws / scope.sizefactor,
						value: scope.chartdata.eh_ws / scope.sizefactor,
						name: 'Water Sanitation',
						group: 'eh',
						x: options.center.x,
						y: options.center.y,
						color: '#ff6d24',
						icon: 'fabric',
						unicode: '\ue604'
					}, {
						id: 4,
						type: 'ev_wr',
						radius: scope.chartdata.ev_wr / scope.sizefactor,
						value: scope.chartdata.ev_wr / scope.sizefactor,
						name: 'Water Resources',
						group: 'ev',
						x: options.center.x,
						y: options.center.y,
						color: '#7993f2',
						icon: 'water',
						unicode: '\ue608'
					}, {
						id: 5,
						type: 'ev_ag',
						radius: scope.chartdata.ev_ag / scope.sizefactor,
						value: scope.chartdata.ev_ag / scope.sizefactor,
						name: 'Agriculture',
						group: 'ev',
						x: options.center.x,
						y: options.center.y,
						color: '#009bcc',
						icon: 'agrar',
						unicode: '\ue600'
					}, {
						id: 6,
						type: 'ev_fo',
						radius: scope.chartdata.ev_fo / scope.sizefactor,
						value: scope.chartdata.ev_fo / scope.sizefactor,
						name: 'Forest',
						group: 'ev',
						x: options.center.x,
						y: options.center.y,
						color: '#2e74ba',
						icon: 'tree',
						unicode: '\ue607'
					}, {
						id: 7,
						type: 'ev_fi',
						radius: scope.chartdata.ev_fi / scope.sizefactor,
						value: scope.chartdata.ev_fi / scope.sizefactor,
						name: 'Fisheries',
						group: 'ev',
						x: options.center.x,
						y: options.center.y,
						color: '#008c8c',
						icon: 'anchor',
						unicode: '\ue601'
					}, {
						id: 8,
						type: 'ev_bd',
						radius: scope.chartdata.ev_bd / scope.sizefactor,
						value: scope.chartdata.ev_bd / scope.sizefactor,
						name: 'Biodiversity and Habitat',
						group: 'ev',
						x: options.center.x,
						y: options.center.y,
						color: '#00ccaa',
						icon: 'butterfly',
						unicode: '\ue602'
					}, {
						id: 9,
						type: 'ev_ce',
						radius: scope.chartdata.ev_ce / scope.sizefactor,
						value: scope.chartdata.ev_ce / scope.sizefactor,
						name: 'Climate and Energy',
						group: 'ev',
						x: options.center.x,
						y: options.center.y,
						color: '#1cb85d',
						icon: 'energy',
						unicode: '\ue603'
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
					});
					links = [
						{source:0, target:1},
						{source:0, target:2},
						{source:0, target:3},
						{source:4, target:5},
						{source:4, target:6},
						{source:4, target:7},
						{source:4, target:8}
					]*/
				};
				var create_vis = function () {
					angular.element(elem).html('');
					options.vis = d3.select(elem[0]).append("svg").attr("width", options.width).attr("height", options.height).attr("id", "svg_vis");
					var pi = Math.PI;
					var arcTop = d3.svg.arc()
						.innerRadius(109)
						.outerRadius(110)
						.startAngle(-90 * (pi / 180)) //converting from degs to radians
						.endAngle(90 * (pi / 180)); //just radians
					var arcBottom = d3.svg.arc()
						.innerRadius(134)
						.outerRadius(135)
						.startAngle(90 * (pi / 180)) //converting from degs to radians
						.endAngle(270 * (pi / 180)); //just radians

					options.arcTop = options.vis.append("path")
						.attr("d", arcTop)
						.attr("fill", "#be5f00")
						.attr("transform", "translate(170,140)");
					options.arcBottom = options.vis.append("path")
						.attr("d", arcBottom)
						.attr("fill", "#006bb6")
						.attr("transform", "translate(170,180)");
					options.containers = options.vis.selectAll('g.node').data(nodes).enter().append('g').attr('transform', 'translate(' + (options.width / 2) + ',' + (options.height / 2) + ')');

					/*options.circles = options.containers.selectAll("circle").data(nodes, function (d) {
						return d.id;
					});*/

					options.circles = options.containers.append("circle").attr("r", 0).attr("fill", (function (d) {
						return d.color || options.fill_color(d.group);
					})).attr("stroke-width", 0).attr("stroke", function (d) {
						return d3.rgb(options.fill_color(d.group)).darker();
					}).attr("id", function (d) {
						return "bubble_" + d.id;
					});
					options.icons = options.containers.append("text")
						.attr('font-family', 'EPI')
						.attr('font-size', function (d) {
							0
						})
						.attr("text-anchor", "middle")
						.attr('fill', '#fff')
						.text(function (d) {
							return d.unicode
						});
					options.icons.on("mouseover", function (d, i) {
						return show_details(d, i, this);
					}).on("mouseout", function (d, i) {
						return hide_details(d, i, this);
					});
					/*options.tooltips = options.containers.append('md-tooltip').html('Photos');
					options.tooltips.call(function () {
						$compile(this[0].parentNode)(scope);
					});*/
					options.circles.transition().duration(options.duration).attr("r", function (d) {
						return d.radius;
					});
					options.icons.transition().duration(options.duration).attr("font-size", function (d) {
						return d.radius * 1.75 + 'px';
					}).attr('y', function (d) {
						return d.radius * .75 + 'px';
					});
				};
				var update_vis = function () {

					nodes.forEach(function (d, i) {
						options.circles.transition().duration(options.duration).delay(i * options.duration)
							.attr("r", function (d) {
								d.radius = d.value = scope.chartdata[d.type] / scope.sizefactor;

								return scope.chartdata[d.type] / scope.sizefactor;
							});
						options.icons.transition().duration(options.duration).delay(i * options.duration)
							.attr("font-size", function (d) {
								return (scope.chartdata[d.type] / scope.sizefactor) * 1.75 + 'px'
							})
							.attr('y', function (d) {
								return (scope.chartdata[d.type] / scope.sizefactor) * .75 + 'px';
							})
					});
				};
				var charge = function (d) {
					return -Math.pow(d.radius, 2.0) / 4;
				};
				var start = function () {
					return options.force = d3.layout.force().nodes(nodes).size([options.width, options.height]).links(links);
				};
				/*var display_group_all = function () {
					options.force.gravity(options.layout_gravity).charge(charge).friction(0.9).on("tick", function (e) {
						return options.circles.each(move_towards_center(e.alpha)).attr('cx', function (d) {
							return d.x;
						}).attr("cy", function (d) {
							return d.y;
						})
					});
					options.force.start();
					//return this.hide_years();
				};*/
				var display_by_cat = function () {
					options.force.gravity(options.layout_gravity).charge(charge).friction(0.9).on("tick", function (e) {
						options.containers.each(move_towards_cat(e.alpha)).attr("transform", function (d) {
							return 'translate(' + d.x + ',' + d.y + ')';
						});
						/*options.icons.each(move_towards_cat(e.alpha)).attr("transform", function (d) {
							return "translate(" + (d.x) + ", " + (d.y) + ")";
						});*/
					});
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
							d.x = d.x + (target.x - d.x) * (target.damper + 0.02) * alpha * 1;
							return d.y = d.y + (target.y - d.y) * (target.damper + 0.02) * alpha * 1;
						}
					})(this);
				};
				var show_details = function (data, i, element) {
					var content;
					//d3.select(element).attr("stroke", "black");
					content = "<span class=\"title\">" + data.name + ":</span><br/>";
					//content +='<div class="close-it" ng-click="options.tooltip.hideTooltip()"><ng-md-icon size="12" icon="close"></ng-md-icon></div>';
					//content += "<span class=\"name\">Value:</span><span class=\"value\"> " + (addCommas(data.value)) + "</span><br/>";
					//content += "<span class=\"name\">Year:</span><span class=\"value\"> " + data.value + "</span>";

					$compile(options.tooltip.showTooltip(content, data, d3.event).contents())(scope);
				};

				var hide_details = function (data, i, element) {
					return options.tooltip.hideTooltip();
				};


				scope.$watch('chartdata', function (data, oldData) {
					options.tooltip.hideTooltip();
					if (options.circles == null) {
						create_nodes();
						create_vis();
						start();
					} else {
						update_vis();
					}

					display_by_cat();
					//$compile(elem)(scope);
				});

				scope.$watch('direction', function (oldD, newD) {
					if (oldD === newD) {
						return;
					}
					if (oldD == "all") {
						display_group_all();
					} else {
						display_by_cat();
					}
				})
			}
		};
	});
})();
