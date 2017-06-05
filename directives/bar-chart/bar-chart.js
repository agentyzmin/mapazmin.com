(function() {
    'use strict';

    var module = angular.module('app.barChart', []);

    module.directive('barChart', [function() {
        return {
            restrict: 'A',
            templateUrl: '/directives/bar-chart/bar-chart.html?build=' + build,
            scope: {
                stats: '='
            }
        };
    }]);
}());