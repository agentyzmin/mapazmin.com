(function() {
    'use strict';

    var COLORS = {
        'roads': '#6D6D6D',
        'yards': '#fcde60',
        'buildings': '#C9CFD2',
        'firstFloorFunction': '#9463C2',
        'cars': '#242424',
        'carsDay': '#242424',
        'carsNight': '#242424',
        'trees': '#91C497',
        'hard_to_reach': '#898989',
        'open': '#fcde60',
        'unreachable': '#666666',
        'office': '#9463C2',
        'cafe': '#FD6E70',
        'garage': '#AAAAAA',
        'culture': '#4390FC',
        'housing': '#FFF6CF',
        'ruin': '#565656',
        'tolerable': '#84B7E3',
        'inactive': '#F06251',
        'monument': '#A082A3',
        'dopey': '#EDA156',
        'hole': '#E2E2E2',
        'active': '#0990C6',
        'green': '#478456',
        'nothing': '#EFD8B8'
    };

    var module = angular.module('app.research.map', []);

    module.directive('researchMap', ['$timeout', function($timeout) {
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
            $timeout(updateMapHeight);

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

            $scope.$watch(function() {
                return $('.filters').outerHeight();
            }, updateMapHeight);

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
                    color: COLORS.roads,
                    opacity: 1,
                    weight: 1,
                    fillColor: COLORS.roads,
                    fillOpacity: 1,
                    smoothFactor: 1
                });

                copyLayers(geoJSONLayer, layerGroups.roads);
                layerGroups.roads.addTo(map);
                filterRoads($scope.roads);
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
                        color: '#AAB3BE',
                        opacity: 1,
                        weight: 1,
                        smoothFactor: 1,
                        fillColor: COLORS[feature.properties.category] || '#000000',
                        fillOpacity: 0.8
                    }
                }

                function onEachFeature(feature, layer) {
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
                        color: '#AAB3BE',
                        opacity: 1,
                        weight: 1,
                        smoothFactor: 1,
                        fillColor: COLORS[feature.properties.floors[1]] || '#000000',
                        fillOpacity: 0.8
                    }
                }

                function onEachFeature(feature, layer) {
                    var index,
                        text = '';

                    if (feature.properties.streets && feature.properties.streets.length) {
                        text += '<p>';
                        text += feature.properties.streets.length > 1 ? 'Вулиці: ' : 'Вулиця: ';
                        for (index in feature.properties.streets) {
                            text += i18n(feature.properties.streets[index]);
                            text += ((feature.properties.streets.length - index > 1) ? ', ' : '');
                        }
                        text += '</p>';
                    }

                    text += '<p>Площа: ' + feature.properties.area.toFixed(2) + '</p>';

                    layer.bindPopup(text);
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
                    color: COLORS.cars,
                    opacity: 1,
                    weight: 1,
                    fillColor: COLORS.cars,
                    fillOpacity: 1,
                    smoothFactor: 1,
                    onEachFeature: onEachFeature
                });

                copyLayers(geoJSONLayer, layerGroups.cars);
                layerGroups.cars.addTo(map);
                filterCars($scope.carsOptions);

                function onEachFeature(feature, layer) {
                    var index,
                        text = '';

                    if (feature.properties.streets && feature.properties.streets.length) {
                        text += '<p>';
                        text += feature.properties.streets.length > 1 ? 'Вулиці: ' : 'Вулиця: ';
                        for (index in feature.properties.streets) {
                            text += i18n(feature.properties.streets[index]);
                            text += ((feature.properties.streets.length - index > 1) ? ', ' : '');
                        }
                        text += '</p>';

                        layer.bindPopup(text);
                    }
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
                        color: COLORS.trees,
                        weight: 1,
                        opacity: 0.8,
                        fillColor: COLORS.trees,
                        fillOpacity: 0.8,
                        zIndex: 200
                    })
                }

                function onEachFeature(feature, layer) {
                    var index,
                        text = '';

                    if (feature.properties.streets && feature.properties.streets.length) {
                        text += '<p>';
                        text += feature.properties.streets.length > 1 ? 'Вулиці: ' : 'Вулиця: ';

                        for (index in feature.properties.streets) {
                            text += i18n(feature.properties.streets[index]);
                            text += ((feature.properties.streets.length - index > 1) ? ', ' : '');
                        }
                        text += '</p>';

                        layer.bindPopup(text);
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
                        color: COLORS[feature.properties.category] || '#000000',
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
                        text += feature.properties.streets.length > 1 ? 'Вулиці: ' : 'Вулиця: ';
                        for (index in feature.properties.streets) {
                            text += i18n(feature.properties.streets[index]);
                            text += ((feature.properties.streets.length - index > 1) ? ', ' : '');
                        }
                        text += '</p>';
                    }

                    text += '<p>Довжина: ' + feature.properties.length.toFixed(2) + ' м.</p>';
                    text += '<p>Категорія: ' + i18n(feature.properties.category) + '</p>';

                    layer.bindPopup(text);
                    layer.options.lineCap = 'butt';
                    layer.options.lineJoin = 'butt'
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

            function i18n(string) {
                var dict = {
                    'roads': 'Дороги',
                    'yards': 'Подвір\'я',
                    'buildings': 'Будівлі',
                    'firstFloorFunction': 'Функція першого поверху',
                    'cars': 'Автомобілі',
                    'carsDay': 'Автомобілі(вдень)',
                    'carsNight': 'Автомобілі(вночі)',
                    'trees': 'Дерева',
                    'hard_to_reach': 'Важкодоступні',
                    'open': 'Відкриті',
                    'unreachable': 'Недосяжні',
                    'office': 'Офіси',
                    'cafe': 'Кафе',
                    'garage': 'Гаражі',
                    'culture': 'Культура',
                    'housing': 'Житло',
                    'ruin': 'Руїни',
                    'facades': 'Фасади',
                    'tolerable': 'Задовільний',
                    'inactive': 'Неактивний',
                    'monument': 'Пам’ятка',
                    'dopey': 'Млявий',
                    'hole': 'Проїзд',
                    'active': 'Активний',
                    'green': 'Озеленення',
                    'nothing': 'Ніякий',
                    'Lypynskoho': 'Липинського',
                    'Volodymyrskyi': 'Володимирський',
                    'Striletska': 'Стрілецька',
                    'Franka': 'Івана Франка',
                    'Zolotovoritska': 'Золотоворітська',
                    'Reitarska': 'Рейтарська',
                    'Kotsiubynskoho': 'Коцюбинського',
                    'Sofiivska': 'Софіївська',
                    'Stritenska': 'Стрітенська',
                    'Irynynska': 'Ірининська',
                    'Honchara': 'Гончара',
                    'Velyka_Zhytomyrska': 'Велика Житомирська',
                    'Khmelnytskogo': 'Хмельницького',
                    'Rylskyi_prov': 'Рильський провулок',
                    'Malopidvalna': 'Малопідвальна',
                    'Prorizna': 'Прорізна',
                    'Volodymyrska': 'Володимирська',
                    'Lysenka': 'Лисенка',
                    'Yaroslaviv_Val': 'Ярославів вал',
                    'Bulvarno_Kudriavska': 'Бульварно-Кудрявська',
                    'Heorhiivskyi': 'Георгіївський'
                };

                return dict[string];
            }

            function updateMapHeight(height) {
                if (!height) {
                    height = $('.filters').outerHeight();
                }

                $element.css('height', height);
                map.invalidateSize();
            }
        }
    }]);
}());