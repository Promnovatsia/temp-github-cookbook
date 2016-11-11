'use strict';

angular
    .module('recipes')
    .factory('RequestService', RequestService);

RequestService.$inject = ['$resource', 'ShelfService', 'MeasureService'];

function RequestService($resource, ShelfService, MeasureService) {
    var Request = $resource('api/request/:requestId', {
        requestId: '@id'
    }, {
        update: {
            method: 'PUT'
        },
        requestByMenu: {
            method: 'GET',
            params: {
                menuId: '@menuId'
            },
            isArray: true,
            url: 'api/menu/:menuId/requests'
        },
        requestByShelf: {
            method: 'GET',
            params: {
                shelfId: '@shelfId'
            },
            isArray: true,
            url: '/api/shelf/:shelfId/requests'
        }
        //TODO add methods to tell apart updating and resolving
    });

    angular.extend(Request.prototype, {
        createOrUpdate: function () {
            var request = this;
            return createOrUpdate(request);
        },
        getMeasure: function () {
            var request = this;
            return getMeasure(request);
        },
        getShelf: function () {
            var request = this;
            return getShelf(request);
        }
    });

    return Request;

    function createOrUpdate(request) {
        if (request.id) {
            return request.$update(onSuccess, onError);
        } else {
            return request.$save(onSuccess, onError);
        }
    }

    function getShelf(request) {
        if (!request.measureId) {
            return false;
        } else {
            return ShelfService.get(
                {
                    shelfId: request.shelfId
                }
            ).$promise.then(function (shelf) {
                if (!shelf) {
                    return false;
                }
                request.shelf = shelf;
                return shelf;
            });
        }
    }

    function getMeasure(request) {
        if (!request.measureId) {
            return false;
        } else {
            MeasureService.get(
                {
                    measureId: request.measureId
                }
            ).$promise.then(function (measure) {
                if (!measure) {
                    return false;
                }
                request.measure = measure;
                return measure;
            });
        }
    }

    function onSuccess(request) {
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
