'use strict';

//Shelf service used for communicating with the shelf REST endpoints
angular.module('recipes').factory('Shelf', ['$resource',
    function($resource) {
        return $resource('api/shelf/:shelfId', {
            shelfId: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);