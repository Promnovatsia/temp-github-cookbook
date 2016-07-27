'use strict';

//Shelf service used for communicating with the shelf REST endpoints
angular
    .module('recipes')
    .factory('ShelfQueryService', ShelfQueryService);

ShelfQueryService.$inject = ['$resource'];

function ShelfQueryService($resource) {
    var ShelfQuery = $resource('api/shelfQuery/:shelfQueryId', {
        shelfQueryId: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
    
    angular.extend(ShelfQuery.prototype, {
        createOrUpdate: function () {
            var shelf = this;
            return createOrUpdate(shelf);
        }
    });
    
    return ShelfQuery;
    
    function createOrUpdate(shelf) {
        if (shelf.id) {
            return shelf.$update(onSuccess, onError);
        } else {
            return shelf.$save(onSuccess, onError);
        }
    }
    
    function onSuccess(shelf) {
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