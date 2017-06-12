(function() {
    'use strict';

    var module = angular.module('app.research.map', ['app.config', 'app.i18n']);

    module.directive('researchMap', ['appConfig', '$timeout', '$window', 'i18n', function(appConfig, $timeout, window, i18n) {
        return {
            restrict: 'A',
            link: link,
            scope: {
                facadesOptions: '=facades',
                buildingsOptions: '=buildings',
                yardsOptions: '=yards',
                carsOptions: '=cars',
                treesOptions: '=trees',
                showRoads: '=roads'
            }
        };

        function link($scope, $element, $attrs) {
            var map, layerGroups;

            init();

            $scope.$watch('facadesOptions', function(val) {
                if (typeof val === 'object') {
                    filterFacades(val);
                }
            });

            $scope.$watch('buildingsOptions', function(val) {
                if (typeof val === 'object') {
                    filterBuildings(val);
                }
            });

            $scope.$watch('yardsOptions', function(val) {
                if (typeof val === 'object') {
                    filterYards(val);
                }
            });

            $scope.$watch('carsOptions', function(val) {
                if (typeof val === 'object') {
                    filterCars(val);
                }
            });

            $scope.$watch('treesOptions', function(val) {
                if (typeof val === 'object') {
                    filterTrees(val);
                }
            });

            $scope.$watch('showRoads', function(val) {
                if (typeof val === 'boolean') {
                    filterRoads(val);
                }
            });

            function init() {
                var layerNames, i,
                    tileLayer = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
                        maxZoom: 18,
                        attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    });

                map = new L.Map($attrs.id, {renderer: L.canvas(), maxZoom: 19});
                map.setView(new L.LatLng(50.450779, 30.510317), 16);
                map.addLayer(tileLayer);

                layerGroups = [];
                layerGroups.roads = L.layerGroup([]);
                layerGroups.yards = L.layerGroup([]);
                layerGroups.buildings = L.layerGroup([]);
                layerGroups.cars = L.layerGroup([]);
                layerGroups.trees = L.layerGroup([]);
                layerGroups.facades = L.layerGroup([]);
                layerGroups.push(layerGroups.roads);
                layerGroups.push(layerGroups.yards);
                layerGroups.push(layerGroups.buildings);
                layerGroups.push(layerGroups.cars);
                layerGroups.push(layerGroups.trees);
                layerGroups.push(layerGroups.facades);

                layerNames = [
                    'roads',
                    'yards',
                    'buildings',
                    'cars',
                    'trees',
                    'facades'
                ];

                for (i = 0; i < layerGroups.length; ++i) {
                    layerGroups[i].name = layerNames[i];
                }

                $.get('geojson/roads.json', initRoads);
                $.get('geojson/yards.json', initYards);
                $.get('geojson/first_floor_function.json', initBuildings);
                $.get('geojson/cars.json', initCars);
                $.get('geojson/trees.json', initTrees);
                $.get('geojson/facades.json', initFacades);
            }

            function initRoads(geoJSON) {
                var geoJSONLayer = L.geoJSON(geoJSON, {
                    color: appConfig.colors.roads,
                    opacity: 1,
                    weight: 1,
                    fillColor: appConfig.colors.roads,
                    fillOpacity: 1,
                    smoothFactor: 1
                });

                copyLayers(geoJSONLayer, layerGroups.roads);
                layerGroups.roads.addTo(map);
                filterRoads($scope.showRoads);
            }

            function filterRoads(isVisible) {
                layerGroups.roads.eachLayer(function(data) {
                    if (!isVisible) {
                        data.options.opacity = 0;
                        data.options.fillOpacity = 0;
                        data.options.interactive = false;
                    } else {
                        data.options.opacity = 1;
                        data.options.fillOpacity = 1;
                        data.options.interactive = true;
                    }
                });

                refreshMap();
            }

            function initYards(geoJSON) {
                var geoJSONLayer = L.geoJSON(geoJSON, {
                    style: style,
                    onEachFeature: onEachFeature
                });

                copyLayers(geoJSONLayer, layerGroups.yards);
                layerGroups.yards.addTo(map);
                filterYards($scope.yardsOptions);

                function style(feature) {
                    return {
                        color: appConfig.colors.yardsBorder,
                        opacity: 1,
                        weight: 1,
                        smoothFactor: 1,
                        fillColor: getColor(feature.properties.category),
                        fillOpacity: 0.8
                    }
                }

                function onEachFeature(feature, layer) {
                }

                function getColor(category) {
                    switch (category.toLowerCase()) {
                        case 'open':
                            return appConfig.colors.accessibilityOpen;

                        case 'hard_to_reach':
                            return appConfig.colors.accessibilityHardToReach;

                        case 'unreachable':
                            return appConfig.colors.accessibilityUnreachable;

                        default:
                            return '#000000';
                    }
                }
            }

            function filterYards(options) {
                layerGroups.yards.eachLayer(function(data) {
                    var category = data.feature.properties && data.feature.properties.category;

                    if (options.indexOf(category) === -1) {
                        data.options.opacity = 0;
                        data.options.fillOpacity = 0;
                        data.options.interactive = false;
                    } else {
                        data.options.opacity = 1;
                        data.options.fillOpacity = 0.8;
                        data.options.interactive = true;
                    }
                });

                refreshMap();
            }

            function initBuildings(geoJSON) {
                var geoJSONLayer = L.geoJSON(geoJSON, {
                    style: style,
                    onEachFeature: onEachFeature
                });

                copyLayers(geoJSONLayer, layerGroups.buildings);
                layerGroups.buildings.addTo(map);
                filterBuildings($scope.buildingsOptions);

                function style(feature) {
                    return {
                        color: appConfig.colors.buildingsBorder,
                        opacity: 1,
                        weight: 1,
                        smoothFactor: 1,
                        fillColor: getColor(feature.properties.floors[1]),
                        fillOpacity: 0.8
                    }
                }

                function onEachFeature(feature, layer) {
                    var index,
                        text = '';

                    if (feature.properties.streets && feature.properties.streets.length) {
                        text += '<p>';
                        text += feature.properties.streets.length > 1 ? i18n.map('streets') : i18n.map('street');
                        for (index in feature.properties.streets) {
                            text += i18n.streets(feature.properties.streets[index]);
                            text += ((feature.properties.streets.length - index > 1) ? ', ' : '');
                        }
                        text += '</p>';
                    }

                    text += '<p>' + i18n.map('area') + feature.properties.area.toFixed(2) + i18n.map('m2') + '</p>';

                    layer.bindPopup(text);
                }

                function getColor(type) {
                    switch (type.toLocaleString()) {
                        case 'ruin':
                            return appConfig.colors.buildingsRuin;

                        case 'housing':
                            return appConfig.colors.buildingsHousing;

                        case 'culture':
                            return appConfig.colors.buildingsCulture;

                        case 'garage':
                            return appConfig.colors.buildingsGarage;

                        case 'cafe':
                            return appConfig.colors.buildingsCafe;

                        case 'office':
                            return appConfig.colors.buildingsOffice;

                        default:
                            return appConfig.colors.error;
                    }
                }
            }

            function filterBuildings(options) {
                layerGroups.buildings.eachLayer(function(data) {
                    var category = data.feature.properties && data.feature.properties.floors[1];

                    if (options.indexOf(category) === -1) {
                        data.options.opacity = 0;
                        data.options.fillOpacity = 0;
                        data.options.interactive = false;
                    } else {
                        data.options.opacity = 1;
                        data.options.fillOpacity = 0.8;
                        data.options.interactive = true;
                    }
                });

                refreshMap();
            }

            function initCars(geoJSON) {
                var geoJSONLayer = L.geoJSON(geoJSON, {
                    style: style,
                    onEachFeature: onEachFeature
                });

                copyLayers(geoJSONLayer, layerGroups.cars);
                layerGroups.cars.addTo(map);
                filterCars($scope.carsOptions);

                function style(feature) {
                    return {
                        color: getColor(feature.properties.streets),
                        opacity: 1,
                        weight: 1,
                        fillColor: getColor(feature.properties.streets),
                        fillOpacity: 1,
                        smoothFactor: 1
                    }
                }

                function onEachFeature(feature, layer) {
                    var index,
                        text = '';

                    if (feature.properties.streets && feature.properties.streets.length) {
                        text += '<p>';
                        text += feature.properties.streets.length > 1 ? i18n.map('streets') : i18n.map('street');
                        for (index in feature.properties.streets) {
                            text += i18n.streets(feature.properties.streets[index]);
                            text += ((feature.properties.streets.length - index > 1) ? ', ' : '');
                        }
                        text += '</p>';

                        layer.bindPopup(text);
                    }
                }

                function getColor(streets) {
                    return (streets && streets.length) ? appConfig.colors.carsStreet : appConfig.colors.carsYard;
                }
            }

            function filterCars(options) {
                var showParkerOnYard = options.indexOf('yard') !== -1,
                    showParkerOnStreet = options.indexOf('street') !== -1;

                layerGroups.cars.eachLayer(function(data) {
                    var onStreet = data.feature.properties.streets && data.feature.properties.streets.length,
                        onYard = !onStreet;

                    data.options.opacity = 0;
                    data.options.fillOpacity = 0;
                    data.options.interactive = false;

                    if ((showParkerOnYard && onYard) || (showParkerOnStreet && onStreet)) {
                        data.options.opacity = 1;
                        data.options.fillOpacity = 1;
                        data.options.interactive = true;
                    }
                });

                refreshMap();
            }

            function initTrees(geoJSON) {
                var geoJSONLayer = L.geoJson(geoJSON, {
                    pointToLayer: pointToLayer,
                    onEachFeature: onEachFeature
                });

                copyLayers(geoJSONLayer, layerGroups.trees);
                layerGroups.trees.addTo(map);
                filterTrees($scope.treesOptions);

                function pointToLayer(feature, latlng) {
                    return L.circle(latlng, {
                        radius: feature.properties.radius,
                        color: getColor(feature.properties.radius),
                        weight: 1,
                        opacity: 0.8,
                        fillColor: getColor(feature.properties.radius),
                        fillOpacity: 0.8,
                        zIndex: 200
                    })
                }

                function onEachFeature(feature, layer) {
                    var index,
                        text = '';

                    if (feature.properties.streets && feature.properties.streets.length) {
                        text += '<p>';
                        text += feature.properties.streets.length > 1 ? i18n.map('streets') : i18n.map('street');

                        for (index in feature.properties.streets) {
                            text += i18n.streets(feature.properties.streets[index]);
                            text += ((feature.properties.streets.length - index > 1) ? ', ' : '');
                        }
                        text += '</p>';

                        layer.bindPopup(text);
                    }
                }

                function getColor(radius) {
                    if (radius < 1) {
                        return appConfig.colors.treesS;
                    } else if (radius < 3) {
                        return appConfig.colors.treesM;
                    } else if (radius >= 3) {
                        return appConfig.colors.treesL;
                    } else {
                        return appConfig.colors.error;
                    }
                }
            }

            function filterTrees(options) {
                layerGroups.trees.eachLayer(function(data) {
                    var size,
                        radius = data.feature.properties.radius;

                    if (radius < 1) {
                        size = 's';
                    } else if (radius < 3) {
                        size = 'm';
                    } else if (radius >= 3) {
                        size = 'l'
                    } else {
                        return;
                    }

                    data.options.opacity = 0;
                    data.options.fillOpacity = 0;
                    data.options.interactive = false;

                    if (options.indexOf(size) !== -1) {
                        data.options.opacity = 1;
                        data.options.fillOpacity = 1;
                        data.options.interactive = true;
                    }
                });

                refreshMap();
            }

            function initFacades(geoJSON) {
                var geoJSONLayer = L.geoJSON(geoJSON, {
                    style: style,
                    onEachFeature: onEachFeature
                });

                copyLayers(geoJSONLayer, layerGroups.facades);
                layerGroups.facades.addTo(map);
                filterFacades($scope.facadesOptions);

                function style(feature) {
                    return {
                        color: getColor(feature.properties.category),
                        opacity: 1,
                        weight: 5,
                        smoothFactor: 0.5
                    }
                }

                function onEachFeature(feature, layer) {
                    var index,
                        text = '';

                    if (feature.properties.streets && feature.properties.streets.length) {
                        text += '<p>';
                        text += feature.properties.streets.length > 1 ? i18n.map('streets') : i18n.map('street');
                        for (index in feature.properties.streets) {
                            text += i18n.streets(feature.properties.streets[index]);
                            text += ((feature.properties.streets.length - index > 1) ? ', ' : '');
                        }
                        text += '</p>';
                    }

                    text += '<p>' + i18n.map('length') + feature.properties.length.toFixed(2) + i18n.map('m') + '</p>';
                    text += '<p>' + i18n.map('category') + i18n.facades(feature.properties.category) + '</p>';

                    layer.bindPopup(text);
                    layer.options.lineCap = 'butt';
                    layer.options.lineJoin = 'butt'
                }

                function getColor(type) {
                    switch (type.toLowerCase()) {
                        case 'active':
                            return appConfig.colors.facadeActive;

                        case 'inactive':
                            return appConfig.colors.facadeInactive;

                        case 'dopey':
                            return appConfig.colors.facadeDopey;

                        case 'green':
                            return appConfig.colors.facadeGreen;

                        case 'hole':
                            return appConfig.colors.facadeHole;

                        case 'monument':
                            return appConfig.colors.facadeMonument;

                        case 'nothing':
                            return appConfig.colors.facadeNothing;

                        case 'tolerable':
                            return appConfig.colors.facadeTolerable;

                        default:
                            return appConfig.colors.error;
                    }
                }
            }

            function filterFacades(options) {
                layerGroups.facades.eachLayer(function(data) {
                    var category = data.feature.properties && data.feature.properties.category;

                    if (options.indexOf(category) === -1) {
                        data.options.opacity = 0;
                        data.options.interactive = false;
                    } else {
                        data.options.opacity = 1;
                        data.options.interactive = true;
                    }
                });

                refreshMap();
            }

            function copyLayers(originLayerGroup, targetLayerGroup) {
                targetLayerGroup.clearLayers();

                originLayerGroup.eachLayer(function (layer) {
                    targetLayerGroup.addLayer(layer);
                });
            }

            function refreshMap() {
                var i;

                for (i = 0; i < layerGroups.length; ++i) {
                    if (map.hasLayer(layerGroups[i])) {

                        layerGroups[i].eachLayer(function (layer) {
                            if (map.hasLayer(layer)) {
                                layer.bringToFront();
                            }
                        });
                    }
                }
            }
        }
    }]);
}());