(function() {
    'use strict';

    var module = angular.module('app.fbRender', []);

    module.directive('fbRender', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $elem) {
                $timeout(function() {
                    if (window.FB && !$elem.attr('fb-xfbml-state')) {
                        window.FB.XFBML.parse($elem.parent()[0]);
                    }
                }, 25);
            }
        };
    }]);
}());