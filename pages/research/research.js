(function() {
    'use strict';

    var module = angular.module('app.research', [
        'ngRoute',
        'app.research.filterSection',
        'app.research.stats',
        'app.research.map',
        'app.research.filtersScale'
    ]);

    module.controller('ResearchCtrl', ['$scope', '$rootScope', '$timeout', 'researchStat', function($scope, $rootScope, $timeout, researchStat) {
        $scope.peopleFilter = [
            {
                id: 'activity',
                name: 'Зайнятість',
                isChecked: true,
                options: [
                    {
                        id: 'students',
                        name: 'Учні'
                    },
                    {
                        id: 'workers',
                        name: 'Працівники'
                    },
                    {
                        id: 'residents',
                        name: 'Мешканці'
                    }
                ]
            }
        ];

        $scope.buildingsFilter = [
            {
                id: 'buildings',
                name: 'Функція',
                isChecked: true,
                options: [
                    {
                        id: 'ruin',
                        name: 'Руїни'
                    },
                    {
                        id: 'housing',
                        name: 'Житло'
                    },
                    {
                        id: 'culture',
                        name: 'Культура'
                    },
                    {
                        id: 'garage',
                        name: 'Гаражі'
                    },
                    {
                        id: 'cafe',
                        name: 'Кафе'
                    },
                    {
                        id: 'office',
                        name: 'Офіси'
                    }
                ]
            },
            {
                id: 'facades',
                name: 'Активність фасадів',
                options: [
                    {
                        id: 'active',
                        name: 'Активний'
                    },
                    {
                        id: 'tolerable',
                        name: 'Задовільний'
                    },
                    {
                        id: 'nothing',
                        name: 'Ніякий'
                    },
                    {
                        id: 'dopey',
                        name: 'Млявий'
                    },
                    {
                        id: 'inactive',
                        name: 'Неактивний'
                    }
                ]
            }
        ];

        $scope.areaFilter = [
            {
                id: 'purpose',
                name: 'Доступність',
                isChecked: true,
                options: [
                    {
                        id: 'roads',
                        name: 'Дороги'
                    },
                    {
                        id: 'open',
                        name: 'Легкодосяжні'
                    },
                    {
                        id: 'hard_to_reach',
                        name: 'Важкодоступні'
                    },
                    {
                        id: 'unreachable',
                        name: 'Недосяжні'
                    }
                ]
            }
        ];

        $scope.objectsFilter = [
            {
                id: 'parking',
                name: 'Парковки',
                isChecked: true,
                options: [
                    {
                        id: 'yard',
                        name: 'Подвір’я'
                    },
                    {
                        id: 'street',
                        name: 'Вулиця'
                    }
                ]
            },
            {
                id: 'trees',
                name: 'Дерева',
                options: [
                    {
                        id: 'l',
                        name: 'Великі'
                    },
                    {
                        id: 'm',
                        name: 'Середні'
                    },
                    {
                        id: 's',
                        name: 'Малі'
                    }
                ]
            }
        ];

        $scope.$watch('isAbsoluteValues', function(value) {
            if (typeof value === 'boolean') { // ignore function call on page initialization
                updatePeopleData();
                updateBuildingsData();
                updateAreaData();
                updateObjectsData();
            }
        });

        $scope.$watch('peopleFilter', updatePeopleData, true);
        $scope.$watch('buildingsFilter', updateBuildingsData, true);
        $scope.$watch('areaFilter', updateAreaData, true);
        $scope.$watch('objectsFilter', updateObjectsData, true);

        function isAllChecked(options) {
            var i,
                len = options.length;

            for (i = 0; i < len; ++i) {
                if (options[i].isChecked) {
                    return false;
                }
            }

            return true;
        }

        function getSelectedOptions(options) {
            var isAll = isAllChecked(options);

            return options
                .filter(function(option) {
                    return (isAll || option.isChecked) ;
                })
                .map(function(option) {
                    return option.id;
                });
        }

        function updatePeopleData() {
            var selectedOptions = getSelectedOptions($scope.peopleFilter[0].options);

            $scope.peopleStat = researchStat.getPeopleStat(selectedOptions, $scope.isAbsoluteValues);
        }

        function updateBuildingsData() {
            var activeFilter;

            $scope.facadesOptions = [];
            $scope.buildingsOptions = [];
            $scope.buildingsStat = null;

            $scope.buildingsFilter.forEach(function(filter) {
                if (filter.isChecked) {
                    activeFilter = filter;
                }
            });

            switch (activeFilter.id) {
                case 'facades':
                    $scope.facadesOptions = getSelectedOptions(activeFilter.options);
                    $scope.buildingsStat = researchStat.getFacadesStat($scope.facadesOptions, $scope.isAbsoluteValues);
                    return;

                case 'buildings':
                    $scope.buildingsOptions = getSelectedOptions(activeFilter.options);
                    $scope.buildingsStat = researchStat.getBuildingsStat($scope.buildingsOptions, $scope.isAbsoluteValues);
                    return;
            }
        }

        function updateAreaData() {
            var selectedOptions = getSelectedOptions($scope.areaFilter[0].options);

            $scope.showRoads = (selectedOptions.indexOf('roads') !== -1);
            $scope.yardsOptions = selectedOptions.filter(function (option) {
                return (option !== 'roads');
            });

            $scope.areaStats = researchStat.getAccessibilityStat(selectedOptions, $scope.isAbsoluteValues);
        }

        function updateObjectsData() {
            var activeFilter;

            $scope.carsOptions = [];
            $scope.treesOptions = [];
            $scope.objectsStats = null;

            $scope.objectsFilter.forEach(function(filter) {
                if (filter.isChecked) {
                    activeFilter = filter;
                }
            });

            switch (activeFilter.id) {
                case 'parking':
                    $scope.carsOptions = getSelectedOptions(activeFilter.options);
                    $scope.objectsStats = researchStat.getCarsStat($scope.carsOptions, $scope.isAbsoluteValues);
                    return;

                case 'trees':
                    $scope.treesOptions = getSelectedOptions(activeFilter.options);
                    $scope.objectsStats = researchStat.getTreesStat($scope.treesOptions, $scope.isAbsoluteValues);
                    return;
            }
        }
    }]);
}());