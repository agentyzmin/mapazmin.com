(function() {
    'use strict';

    var module = angular.module('app.research.filterSection', ['app.barChart', 'app.i18n']);

    module.directive('filterSection', ['i18n', function(i18n) {
        return {
            restrict: 'A',
            link: link,
            templateUrl: '/directives/filter-section/filter-section.html?build=' + build,
            scope: {
                title: '@',
                filters: '=',
                stats: '='
            }
        };

        function link($scope, $element, $attrs) {
            $scope.i18n = i18n;
            $scope.id = $scope.$id;
            $scope.allButtonState = {};

            $scope.filterBy = filterBy;
            $scope.onFilterValueChange = onFilterValueChange;
            $scope.checkAll = checkAll;

            if (!$scope.filters) {
                console.error('Filters are not set. Element ', $element);
                return;
            }

            $scope.filters.forEach(function(filter) {
                if (filter.isChecked) {
                    $scope.activeFilter = filter;
                }

                filter.options.forEach(function(option) {
                    option.isChecked = false;
                });

                filter.isAllChecked = true;
            });

            function filterBy(filter) {
                $scope.filters.forEach(function(filter) {
                    filter.isChecked = false;
                });

                filter.isChecked = true;
                $scope.activeFilter = filter;
            }

            function onFilterValueChange(filter) {
                var isAllSelected = isAllOptionsChecked(filter);

                if (isAllSelected) {
                    filter.options.forEach(function(option) {
                        option.isChecked = false;
                    });

                    filter.isAllChecked = true;
                } else {
                    filter.isAllChecked = false;
                }
            }

            function checkAll(filter) {
                filter.options.forEach(function(option) {
                    option.isChecked = false;
                });
            }
        }

        function isAllOptionsChecked(filter) {
            var result = true;

            filter.options.forEach(function(option) {
                if (!option.isChecked) {
                    result = false;
                }
            });

            return result;
        }
    }]);
}());