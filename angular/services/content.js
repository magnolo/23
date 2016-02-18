(function() {
	"use strict";

	angular.module('app.services').factory('ContentService', function(DataService) {
		//
		return {
			content: {
				indicators: [],
				indicator: {},
				data: [],
				categories: [],
				category: {},
				styles: [],
				infographics: [],

			},
			fetchIndicators: function(filter) {
				return this.content.indicators = DataService.getAll('indicators', filter).$object
			},
			fetchCategories: function(filter) {
				return this.content.categories = DataService.getAll('categories', filter).$object;
			},
			fetchStyles: function(filter) {
				return this.content.styles = DataService.getAll('styles', filter).$object;
			},
			getCategories: function(filter) {
				if (this.content.categories.length == 0) {
					return this.fetchCategories(filter);
				}
				return this.content.categories;
			},
			getIndicators: function() {
				if (this.content.indicators.length > 0) {
					return this.content.indicators;
				}
				return this.fetchIndicators();

			},
			getStyles: function(filter) {
				if (this.content.styles.length == 0) {
					return this.fetchStyles(filter);
				}
				return this.content.styles;
			},
			getIndicator: function(id) {
				if (this.content.indicators.length > 0) {
					for (var i = 0; i < this.content.indicators.length; i++) {
						if (this.content.indicators[i].id == id) {
							return this.content.indicators[i];
						}
					}
				}
				return this.fetchIndicator(id);
			},
			fetchIndicator: function(id) {
				return this.content.indicator = DataService.getOne('indicators/' + id).$object;
			},
			fetchIndicatorPromise: function(id) {
				return DataService.getOne('indicators',id);
			},
			getIndicatorData: function(id, year) {
				if (year) {
					return this.content.data = DataService.getAll('indicators/' + id + '/data/' + year);
				}
				return this.content.data = DataService.getAll('indicators/' + id + '/data');
			},
			getItem: function(id) {
				return this.content.data = DataService.getOne('index/' + id)
			},
			getCategory: function(id) {
				if (this.content.categories.length) {
					for (var i = 0; i < this.content.categories.length; i++) {
						if (this.content.categories[i].id == id) {
							return this.content.categories[i];
						}
					}
				} else {
					return this.content.category = DataService.getOne('categories/' + id).$object;
				}
			}

		}
	});

})();
