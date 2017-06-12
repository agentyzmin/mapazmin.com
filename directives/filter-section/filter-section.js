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
            $scope.allCheckedFilters = {};

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

                $scope.allCheckedFilters[filter.id] = isAllChecked(filter);
            });

            function filterBy(filter) {
                $scope.filters.forEach(function(filter) {
                    filter.isChecked = false;
                });

                filter.isChecked = true;
                $scope.activeFilter = filter;
            }

            function onFilterValueChange(filter) {
                $scope.allCheckedFilters[filter.id] = isAllChecked(filter);
            }

            function checkAll(filter) {
                $scope.allCheckedFilters[filter.id] = true;

                filter.options.forEach(function(option) {
                    option.isChecked = false;
                });
            }
        }

        function isAllChecked(filter) {
            var result = true;

            filter.options.forEach(function(option) {
                if (option.isChecked) {
                    result = false;
                }
            });

            return result;
        }
    }]);
}());