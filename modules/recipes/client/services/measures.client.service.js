'use strict';

//Measures service used for communicating with the measures REST endpoints
angular.module('recipes').factory('Measures', ['$resource',
    function($resource) {
        return $resource('api/measures/:measureId', {
            measureId: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);