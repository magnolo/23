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