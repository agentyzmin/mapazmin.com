(function() {
    'use strict';

    var module = angular.module('app.research.stats', ['app.config', 'app.i18n']);

    module.factory('researchStat', ['appConfig', 'i18n', function(appConfig, i18n) {
        function getPeopleStat(filter, isAbsolute) {
            var summary = 0,
                filtered = 0,
                options = [
                {
                    id: 'students',
                    name: i18n.people('students'),
                    value: 150
                },
                {
                    id: 'workers',
                    name: i18n.people('workers'),
                    value: 650
                },
                {
                    id: 'residents',
                    name: i18n.people('residents'),
                    value: 200
                }
            ];

            options = options.filter(function(option) {
                var result = filter.indexOf(option.id) !== -1;

                summary += option.value;
                filtered += result ? option.value : 0;

                return result;
            });

            options = options.map(function(option) {
                var text;

                if (isAbsolute) {
                    text = option.name + ' - ' + option.value + ' ' + i18n.people('unit')
                } else {
                    text = option.name + ' - ' + Math.round(option.value / summary * 100) + '%'
                }

                return {
                    width: Math.round(option.value / filtered * 100),
                    text: text
                }
            });

            return {
                options: options,
                total: isAbsolute ? filtered + ' ' + i18n.people('unit') : (filtered / summary * 100) + '%'
            }
        }

        function getBuildingsStat(filter, isAbsolute) {
            var summary = 0,
                filtered = 0,
                options = [
                    {
                        id: 'ruin',
                        name: i18n.buildings('ruin'),
                        color: appConfig.colors.buildingsRuin,
                        value: 24370
                    },
                    {
                        id: 'housing',
                        name: i18n.buildings('housing'),
                        color: appConfig.colors.buildingsHousing,
                        value: 28013
                    },
                    {
                        id: 'culture',
                        name: i18n.buildings('culture'),
                        color: appConfig.colors.buildingsCulture,
                        value: 39296
                    },
                    {
                        id: 'garage',
                        name: i18n.buildings('garage'),
                        color: appConfig.colors.buildingsGarage,
                        value: 51213
                    },
                    {
                        id: 'cafe',
                        name: i18n.buildings('cafe'),
                        color: appConfig.colors.buildingsCafe,
                        value: 83502
                    },
                    {
                        id: 'office',
                        name: i18n.buildings('office'),
                        color: appConfig.colors.buildingsOffice,
                        value: 191814
                    }
                ];

            options = options.filter(function(option) {
                var result = filter.indexOf(option.id) !== -1;

                summary += option.value;
                filtered += result ? option.value : 0;

                return result;
            });

            options = options.map(function(option) {
                var text;

                if (isAbsolute) {
                    text = option.name + ' - ' + option.value + ' ' + i18n.buildings('unit');
                } else {
                    text = option.name + ' - ' + Math.round(option.value / summary * 100) + '%'
                }

                return {
                    width: Math.round(option.value / filtered * 100),
                    color: option.color,
                    text: text
                }
            });

            return {
                options: options,
                total: isAbsolute ? Math.round(filtered) + ' ' + i18n.buildings('unit') : Math.round(filtered / summary * 100) + '%'
            }
        }

        function getFacadesStat(filter, isAbsolute) {
            var summary = 0,
                filtered = 0,
                options = [
                    {
                        id: 'active',
                        name: i18n.facades('active'),
                        color: appConfig.colors.facadeActive,
                        value: 586.79
                    },
                    {
                        id: 'tolerable',
                        name: i18n.facades('tolerable'),
                        color: appConfig.colors.facadeTolerable,
                        value: 3377.67
                    },
                    {
                        id: 'nothing',
                        name: i18n.facades('nothing'),
                        color: appConfig.colors.facadeNothing,
                        value: 11167.84
                    },
                    {
                        id: 'dopey',
                        name: i18n.facades('dopey'),
                        color: appConfig.colors.facadeDopey,
                        value: 3756.96
                    },
                    {
                        id: 'inactive',
                        name: i18n.facades('inactive'),
                        color: appConfig.colors.facadeInactive,
                        value: 1899.50
                    }
                ];

            options = options.filter(function(option) {
                var result = filter.indexOf(option.id) !== -1;

                summary += option.value;
                filtered += result ? option.value : 0;

                return result;
            });

            options = options.map(function(option) {
                var text;

                if (isAbsolute) {
                    text = option.name + ' - ' + option.value + ' ' + i18n.facades('unit');
                } else {
                    text = option.name + ' - ' + Math.round(option.value / summary * 100) + '%'
                }

                return {
                    width: Math.round(option.value / filtered * 100),
                    color: option.color,
                    text: text
                }
            });

            return {
                options: options,
                total: isAbsolute ? Math.round(filtered) + ' ' + i18n.facades('unit') : Math.round(filtered / summary * 100) + '%'
            }
        }

        function getAccessibilityStat(filter, isAbsolute) {
            var summary = 0,
                filtered = 0,
                options = [
                    {
                        id: 'roads',
                        name: i18n.accessibility('roads'),
                        color: appConfig.colors.roads,
                        value: 115546
                    },
                    {
                        id: 'open',
                        name: i18n.accessibility('open'),
                        color: appConfig.colors.accessibilityOpen,
                        value: 226849
                    },
                    {
                        id: 'hard_to_reach',
                        name: i18n.accessibility('hardToReach'),
                        color: appConfig.colors.accessibilityHardToReach,
                        value: 246957
                    },
                    {
                        id: 'unreachable',
                        name: i18n.accessibility('unreachable'),
                        color: appConfig.colors.accessibilityUnreachable,
                        value: 184953
                    }
                ];

            options = options.filter(function(option) {
                var result = filter.indexOf(option.id) !== -1;

                summary += option.value;
                filtered += result ? option.value : 0;

                return result;
            });

            options = options.map(function(option) {
                var text;

                if (isAbsolute) {
                    text = option.name + ' - ' + option.value + ' ' + i18n.accessibility('unit');
                } else {
                    text = option.name + ' - ' + Math.round(option.value / summary * 100) + '%'
                }

                return {
                    width: Math.round(option.value / filtered * 100),
                    color: option.color,
                    text: text
                }
            });

            return {
                options: options,
                total: isAbsolute ? Math.round(filtered) + ' ' + i18n.accessibility('unit') : Math.round(filtered / summary * 100) + '%'
            }
        }

        function getCarsStat(filter, isAbsolute) {
            var summary = 0,
                filtered = 0,
                options = [
                    {
                        id: 'yard',
                        name: i18n.parking('yard'),
                        value: 1972
                    },
                    {
                        id: 'street',
                        name: i18n.parking('street'),
                        value: 2249
                    }
                ];

            options = options.filter(function(option) {
                var result = filter.indexOf(option.id) !== -1;

                summary += option.value;
                filtered += result ? option.value : 0;

                return result;
            });

            options = options.map(function(option) {
                var text;

                if (isAbsolute) {
                    text = option.name + ' - ' + option.value + ' ' + i18n.trees('unit');
                } else {
                    text = option.name + ' - ' + Math.round(option.value / summary * 100) + '%'
                }

                return {
                    width: Math.round(option.value / filtered * 100),
                    text: text
                }
            });

            return {
                options: options,
                total: isAbsolute ? Math.round(filtered) + ' ' + i18n.trees('unit') : Math.round(filtered / summary * 100) + '%'
            }
        }

        function getTreesStat(filter, isAbsolute) {
            var summary = 0,
                filtered = 0,
                options = [
                    {
                        id: 'l',
                        name: i18n.trees('l'),
                        value: 833
                    },
                    {
                        id: 'm',
                        name: i18n.trees('m'),
                        value: 829
                    },
                    {
                        id: 's',
                        name: i18n.trees('s'),
                        value: 374
                    }
                ];

            options = options.filter(function(option) {
                var result = filter.indexOf(option.id) !== -1;

                summary += option.value;
                filtered += result ? option.value : 0;

                return result;
            });

            options = options.map(function(option) {
                var text;

                if (isAbsolute) {
                    text = option.name + ' - ' + option.value + ' ' + i18n.trees('unit');
                } else {
                    text = option.name + ' - ' + Math.round(option.value / summary * 100) + '%'
                }

                return {
                    width: Math.round(option.value / filtered * 100),
                    text: text
                }
            });

            return {
                options: options,
                total: isAbsolute ? Math.round(filtered) + ' ' + i18n.trees('unit') : Math.round(filtered / summary * 100) + '%'
            }
        }

        return {
            getPeopleStat: getPeopleStat,
            getBuildingsStat: getBuildingsStat,
            getFacadesStat: getFacadesStat,
            getAccessibilityStat: getAccessibilityStat,
            getCarsStat: getCarsStat,
            getTreesStat: getTreesStat
        }
    }]);
}());