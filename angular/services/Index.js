(function(){
    "use strict";

    angular.module('app.services').factory('IndexService', function(){
        return {
          getEpi: function(){
            return {
        			 name:'EPI',
        			 full_name: 'Environment Performance Index',
        			 table: 'epi',
        			 allCountries: 'yes',
        			 countries: [],
        			 score_field_name: 'score',
        			 change_field_name: 'percent_change',
        			 order_field: 'year',
        			 countries_id_field: 'country_id',
        			 countries_iso_field: 'iso',
               color: '#ff9600',
        			 children:[{
        				 column_name: 'eh',
        				 title: 'Enviromental Health',
        				 range:[0, 100],
        				 size: 1000,
        				 icon:'',
        				 color:'',
        				 children:[{
        					 column_name:'eh_hi',
        					 title:'Health Impact',
                   size:20,
        					 icon: 'man',
        					 unicode: '\ue605',
        					 color: '#ff9600',
        					 children:[{
        						 column_name: 'eh_hi_child_mortality',
        						 title:'Child Mortality',
                     size:20,
        						 icon:'',
        						 color:'',
        						 description:'Probability of dying between a childs first and fifth birthdays (between age 1 and 5)'
        					 }]
        				 },{
        					 column_name:'eh_aq',
        					 title:'Air Quality',
                   size:20,
        					 color: '#f7c80b',
        					 icon: 'sink',
        					 unicode: '\ue606',
        					 children:[{
        						 column_name: 'eh_aq_household_air_quality',
        						 title:'Household Air Quality',
                     size:20,
        						 icon:'',
        						 color:'',
        						 description:'Percentage of the population using solid fuels as primary cooking fuel.'
        					 },{
        						 column_name: 'eh_aq_exposure_pm25',
        						 title:'Air Pollution - Average Exposure to PM2.5',
                     size:20,
        						 icon:'',
        						 color:'',
        						 description:'Population weighted exposure to PM2.5 (three- year average)'
        					 },{
        						 column_name: 'eh_aq_exceedance_pm25',
        						 title:'Air Pollution - PM2.5 Exceedance',
                     size:20,
        						 icon:'',
        						 color:'',
        						 description:'Proportion of the population whose exposure is above  WHO thresholds (10, 15, 25, 35 micrograms/m3)'
        					 }]
        				 },{
        					 column_name:'eh_ws',
        					 title:'Water Sanitation',
                   size:20,
        					 color: '#ff6d24',
        					 icon: 'fabric',
        					 unicode: '\ue604',
        					 children:[{
        						column_name: 'eh_ws_access_to_drinking_water',
        						title:'Access to Drinking Water',
                    size:20,
        						icon:'',
        						color:'',
        						description:'Percentage of population with access to improved drinking water source'
        					},{
        						column_name: 'eh_ws_access_to_sanitation',
        						title:'Access to Sanitation',
                    size:20,
        						icon:'',
        						color:'',
        						description:'Percentage of population with access to improved sanitation'
        					}]
        				 }]
        			 },{
        				 column_name: 'ev',
        				 title: 'Ecosystem Validity',
        				 range:[0, 100],
        				 size:1000,
        				 icon:'',
        				 color:'#7993f2',
        				 children:[{
        					 column_name:'ev_wr',
        					 title:'Water Resources',
                   size:20,
        					 color: '#7993f2',
        					 icon: 'water',
        					 unicode: '\ue608',
        					 children:[{
        						 column_name: 'ev_wr_wastewater_treatment',
        						 title:'Wastewater Treatment',
                     size:20,
        						 icon:'',
        						 color:'',
        						 description:'Wastewater treatment level weighted by connection to wastewater treatment rate.'
        					 }]
        				 },{
        					 column_name:'ev_ag',
        					 title:'Agriculture',
                   size:20,
        					 color: '#009bcc',
        					 icon: 'agrar',
        					 unicode: '\ue600',
        					 children:[{
        						 column_name: 'ev_ag_agricultural_subsidies',
        						 title:'Agricultural Subsidies',
                     size:20,
        						 icon:'',
        						 color:'#009bcc',
        						 description:'Subsidies are expressed in price of their product in the domestic market (plus any direct output subsidy) less its price at the border, expressed as a percentage of the border price (adjusting for transport costs and quality differences).'
        					 },{
        						 column_name: 'ev_ag_pesticide_regulation',
        						 title:'Pesticide Regulation',
                     size:20,
        						 icon:'',
        						 color:'#009bcc',
        						 description:'Wastewater treatment level weighted by connection to wastewater treatment rate.'
        					 }]
        				 },{
        					 column_name:'ev_fo',
        					 title:'Forest',
                   size:20,
        					 color: '#2e74ba',
        					 icon: 'tree',
        					 unicode: '\ue607',
        					 children:[{
        						 column_name: 'ev_fo_change_in_forest_cover',
        						 title:'Change in Forest Cover',
                     size:20,
        						 icon:'',
        						 color:'#2e74ba',
        						 description:'Forest loss - Forest gain in > 50% tree cover, as compared to 2000 levels.'
        					 }]
        				 },{
        					 column_name:'ev_fi',
        					 title:'Fisheries',
                   size:20,
        					 color: '#008c8c',
        					 icon: 'anchor',
        					 unicode: '\ue601',
        					 children:[{
        						 column_name: 'ev_fi_coastal_shelf_fishing_pressure',
        						 title:'Coastal Shelf Fishing Pressure',
                     size:20,
        						 icon:'',
        						 color:'#008c8c',
        						 description:'Catch in metric tons from trawling and dredging gears (mostly bottom trawls) divided by EEZ area.'
        					 },{
        						 column_name: 'ev_fi_fish_stocks',
        						 title:'Fish Stocks',
                     size:20,
        						 icon:'',
        						 color:'#008c8c',
        						 description:'Percentage of fishing stocks overexploited and collapsed from EEZ.'
        					 }]
        				 },{
        					 column_name:'ev_bd',
        					 title:'Biodiversity and Habitat',
                   size:20,
        					 color: '#00ccaa',
        					 icon: 'butterfly',
        					 unicode: '\ue602',
        					 children:[{
        						 column_name: 'ev_bd_terrestrial_protected_areas_national_biome',
        						 title:'Terrestrial Protected Areas (National Biome Weights)',
                     size:20,
        						 icon:'',
        						 color:'#00ccaa',
        						 description:'Percentage of terrestrial biome area that is protected, weighted by domestic biome area.'
        					 },{
        						 column_name: 'ev_bd_terrestrial_protected_areas_global_biome',
        						 title:'Terrestrial Protected Areas (Global Biome Weights)',
                     size:20,
        						 icon:'',
        						 color:'#00ccaa',
        						 description:'Percentage of terrestrial biome area that is protected, weighted by global biome area.'
        					 },{
        						 column_name: 'ev_bd_marine_protected_areas',
        						 title:'Marine Protected Areas',
                     size:20,
        						 icon:'',
        						 color:'#00ccaa',
        						 description:'Marine protected areas as a percent of EEZ.'
        					 },{
        						 column_name: 'ev_bd_critical_habitat_protection',
        						 title:'Critical Habitat Protection',
                     size:20,
        						 icon:'',
        						 color:'#00ccaa',
        						 description:'Percentage of terrestrial biome area that is protected, weighted by global biome area.'
        					 }]
        				 },{
        					 column_name:'ev_ce',
        					 title:'Climate and Energy',
                   size:20,
        					 color: '#1cb85d',
        					 icon: 'energy',
        					 unicode: '\ue603',
        					 children:[{
        						 column_name: 'ev_ce_trend_in_carbon_intensity',
        						 title:'Trend in Carbon Intensity',
                     size:20,
        						 icon:'',
        						 color:'#1cb85d',
        						 description:'Change in CO2 emissions per unit GDP from 1990 to 2010.'
        					 },{
        						 column_name: 'ev_ce_change_of_trend_in_carbon_intesity',
        						 title:'Change of Trend in Carbon Intensity',
                     size:20,
        						 icon:'',
        						 color:'#1cb85d',
        						 description:'Change in Trend of CO2 emissions per unit GDP from 1990 to 2000; 2000 to 2010.'
        					 },{
        						 column_name: 'ev_ce_trend_in_co2_emissions_per_kwh',
        						 title:'Trend in CO2 Emissions per KWH',
                     size:20,
        						 icon:'',
        						 color:'#1cb85d',
        						 description:'Change in CO2 emissions from electricity and heat production.'
        					 }]
        				 }]
        			 }]
        		};
          }
        }
    });

})();
