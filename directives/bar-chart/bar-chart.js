(function() {
    'use strict';

    var module = angular.module('app.barChart', ['app.i18n']);

    module.directive('barChart', ['i18n', function(i18n) {
        return {
            restrict: 'A',
            templateUrl: '/directives/bar-chart/bar-chart.html?build=' + build,
            scope: {
                stats: '='
            },
            link: function($scope) {
                $scope.i18n = i18n;
            }
        };
    }]);
}());