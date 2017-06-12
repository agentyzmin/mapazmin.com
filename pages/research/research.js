(function() {
    'use strict';

    var module = angular.module('app.research', [
        'ngRoute',
        'app.research.filterSection',
        'app.research.stats',
        'app.research.map',
        'app.research.filtersScale',
        'app.i18n'
    ]);

    module.controller('ResearchCtrl', ['$scope', '$rootScope', '$timeout', 'researchStat', 'i18n', function($scope, $rootScope, $timeout, researchStat, i18n) {
        $scope.i18n = i18n;

        $scope.peopleFilter = [
            {
                id: 'activity',
                name: i18n.people('filterName'),
                isChecked: true,
                options: [
                    {
                        id: 'students',
                        name: i18n.people('students')
                    },
                    {
                        id: 'workers',
                        name: i18n.people('workers')
                    },
                    {
                        id: 'residents',
                        name: i18n.people('residents')
                    }
                ]
            }
        ];

        $scope.buildingsFilter = [
            {
                id: 'buildings',
                name: i18n.buildings('filterName'),
                isChecked: true,
                options: [
                    {
                        id: 'ruin',
                        name: i18n.buildings('ruin')
                    },
                    {
                        id: 'housing',
                        name: i18n.buildings('housing')
                    },
                    {
                        id: 'culture',
                        name: i18n.buildings('culture')
                    },
                    {
                        id: 'garage',
                        name: i18n.buildings('garage')
                    },
                    {
                        id: 'cafe',
                        name: i18n.buildings('cafe')
                    },
                    {
                        id: 'office',
                        name: i18n.buildings('office')
                    }
                ]
            },
            {
                id: 'facades',
                name: i18n.facades('filterName'),
                options: [
                    {
                        id: 'active',
                        name: i18n.facades('active')
                    },
                    {
                        id: 'tolerable',
                        name: i18n.facades('tolerable')
                    },
                    {
                        id: 'nothing',
                        name: i18n.facades('nothing')
                    },
                    {
                        id: 'dopey',
                        name: i18n.facades('dopey')
                    },
                    {
                        id: 'inactive',
                        name: i18n.facades('inactive')
                    }
                ]
            }
        ];

        $scope.areaFilter = [
            {
                id: 'purpose',
                name: i18n.accessibility('filterName'),
                isChecked: true,
                options: [
                    {
                        id: 'roads',
                        name: i18n.accessibility('roads')
                    },
                    {
                        id: 'open',
                        name: i18n.accessibility('open')
                    },
                    {
                        id: 'hard_to_reach',
                        name: i18n.accessibility('hardToReach')
                    },
                    {
                        id: 'unreachable',
                        name: i18n.accessibility('unreachable')
                    }
                ]
            }
        ];

        $scope.objectsFilter = [
            {
                id: 'parking',
                name: i18n.parking('filterName'),
                isChecked: true,
                options: [
                    {
                        id: 'yard',
                        name: i18n.parking('yard')
                    },
                    {
                        id: 'street',
                        name: i18n.parking('street')
                    }
                ]
            },
            {
                id: 'trees',
                name: i18n.trees('filterName'),
                options: [
                    {
                        id: 'l',
                        name: i18n.trees('l')
                    },
                    {
                        id: 'm',
                        name: i18n.trees('m')
                    },
                    {
                        id: 's',
                        name: i18n.trees('s')
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