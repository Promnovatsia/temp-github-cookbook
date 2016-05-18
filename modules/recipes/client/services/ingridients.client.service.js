'use strict';

//Ingridients service used for communicating with the ingridients REST endpoints
angular.module('recipes').factory('Ingridients', ['$resource',
    function($resource) {
        return $resource('api/ingridients/:ingridientId', {
            ingridientId: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);