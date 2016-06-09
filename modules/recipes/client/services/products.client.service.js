'use strict';

//Products service used for communicating with the products REST endpoints
angular.module('recipes').factory('Products', ['$resource',
    function($resource) {
        return $resource('api/products/:productId', {
            productId: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);