'use strict';

//Shelf service used for communicating with the shelf REST endpoints
angular
    .module('recipes')
    .factory('ShelfService', ShelfService);

ShelfService.$inject = ['$resource'];

function ShelfService($resource) {
    var Shelf = $resource('api/shelf/:shelfId', {
        shelfId: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
    
    angular.extend(Shelf.prototype, {
        createOrUpdate: function () {
            var shelf = this;
            return createOrUpdate(shelf);
        }
    });
    
    return Shelf;
    
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