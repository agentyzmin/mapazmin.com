(function() {
    'use strict';

    var module = angular.module('app.config', []);

    module.factory('appConfig', [function() {
        return {
            colors: {
                error: '#FF0000',
                roads: '#6D6D6D',
                yardsBorder: '#AAB3BE',
                accessibilityOpen: '#FCDE60',
                accessibilityHardToReach: '#898989',
                accessibilityUnreachable: '#666666',
                carsYard: '#242424',
                carsStreet: '#242424',
                treesS: '#91C497',
                treesM: '#91C497',
                treesL: '#91C497',
                buildingsRuin: '#565656',
                buildingsHousing: '#FFF6CF',
                buildingsCulture: '#4390FC',
                buildingsGarage: '#AAAAAA',
                buildingsCafe: '#FD6E70',
                buildingsOffice: '#9463C2',
                facadeActive: '#0990C6',
                facadeInactive: '#F06251',
                facadeDopey: '#EDA156',
                facadeNothing: '#EFD8B8',
                facadeTolerable: '#84B7E3'
            }
        }
    }]);
}());