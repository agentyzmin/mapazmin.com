(function() {
    'use strict';

    var module = angular.module('app.research.filtersScale', []);

    module.directive('filtersScale', ['$window', function(window) {
        return {
            restrict: 'A',
            link: link
        };

        function link($scope, $element, $attrs) {
            var $window = $(window);

            $element.css('transform-origin', '0 0');
            $window.on('resize', resize);
            resize();

            $scope.$watch(function() {
                return $element.outerHeight();
            }, resize);

            function resize() {
                var zoom = 1,
                    size = $window.width() / 2;

                if (size < 875) {
                    zoom = size / 875;
                }

                $element.css('transform', 'scale(' + zoom + ')');
                $element.parent().css('height', $element.outerHeight());
            }
        }
    }]);
}());