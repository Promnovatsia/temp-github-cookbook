'use strict';

//Shelf service used for communicating with the shelf REST endpoints
angular
    .module('recipes')
    .factory('ShelfQueryService', ShelfQueryService);

ShelfQueryService.$inject = ['$resource'];

function ShelfQueryService($resource) {
    var ShelfQuery = $resource('api/shelf/:shelfId/query/:queryId', {
        shelfId: '@shelfId',
        queryId: '@number'
    }, {
        update: {
            method: 'PUT'
        }
    });
    
    angular.extend(ShelfQuery.prototype, {
        createOrUpdate: function () {
            var shelfQuery = this;
            return createOrUpdate(shelfQuery);
        }
    });
    
    return ShelfQuery;
    
    function createOrUpdate(shelfQuery) {
        if (shelfQuery.id) {
            return shelfQuery.$update(onSuccess, onError);
        } else {
            return shelfQuery.$save(onSuccess, onError);
        }
    }
    
    function onSuccess(shelfQuery) {
        // Any required internal processing from inside the service, goes here.    
    }
    
    // Handle error response
    function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
    }

    function handleError(error) {
        // Log error
        console.log(error);
    }
}