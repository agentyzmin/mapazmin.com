(function() {
    'use strict';

    angular
        .module('app', [
            'ngRoute',
            'app.research'
        ])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $locationProvider.html5Mode(true);

            $routeProvider
                .when('/research', {
                    controller: 'ResearchCtrl',
                    templateUrl: function() {
                        return '/pages/research/research.html?build=' + build;
                    }
                })
                .otherwise({ redirectTo: '/research' });
        }]);

}());