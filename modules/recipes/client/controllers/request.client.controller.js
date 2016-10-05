'use strict';

angular
    .module('recipes')
    .controller('RequestController', RequestController);

RequestController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'RequestService', 'ShelfService'];

function RequestController($scope, $stateParams, $location, $window, Authentication, RequestService, ShelfService) {

    $scope.authentication = Authentication;
    $scope.error = null;
    $scope.asyncShelves = [];
    $scope.asyncMeasures = [];
    $scope.isImmediatelyResolvable = false;

    $scope.imageurl = 'http://res.cloudinary.com/thomascookbook/image/upload/v1466671927/';

    $scope.find = function () {
        RequestService.query().$promise.then(function (requests) {
            $scope.requests = requests;
        });
    };

    $scope.findOne = function () {
        if ($stateParams.requestId) {
            RequestService.get(
                {
                    requestId: $stateParams.requestId
                }
            ).$promise.then(function (request) {
                if (request.getShelf()) {
                    $scope.shelf = request.shelf;
                    $scope.shelf.getMeasure();
                }
                $scope.request = request;
                $scope.request.getMeasure();
                $scope.request.buyDate = request.buyDate ? new Date(request.buyDate) : Date.now(); //TODO check date construction console error
            });
        } else {
            $scope.request = new RequestService(
                {
                    createdAt: Date.now(),
                    buyDate: Date.now(),
                    requested: 1
                }
            );
        }
    };

    $scope.getAsyncShelves = function (value) {
        var matched = [];
        if ($scope.asyncShelves.length === 0) {
            return ShelfService.query().$promise.then(function (results) {
                $scope.asyncShelves = results;
                results.forEach(function (item, i, arr) {
                    if (item.caption.includes(value)) {
                        matched.push(item);
                    }
                });
                return matched;
            });
        } else {
            $scope.asyncShelves.forEach(function (item, i, arr) {
                if (item.caption.includes(value)) {
                    matched.push(item);
                }
            });
            return matched;
        }
    };

    $scope.selectShelf = function (shelf) {
        $scope.shelf = shelf;
        $scope.shelf.storedOriginaly = $scope.shelf.stored;
        var a = $scope.shelf.getMeasure();
        if (a) {
            a.then(function (measure) {
                $scope.request.measure = measure;
            });
        }
    };

    $scope.clearAsyncShelf = function () {
        $scope.asyncShelf = '';
        $scope.asyncShelves = [];
    };

    $scope.applyMeasure = function () {
        $scope.request.measure = $scope.shelf.measure;
        $scope.request.requested = $scope.required.measure.min;
        $scope.$scope.checkRequest(null, $scope.request.requested);
    };

    $scope.checkRequest = function (id, value, oldValue) {
        if (!$scope.shelf) {
            return false;
        }
        if ($scope.request.measure.id === $scope.shelf.measure.id) {
            $scope.request.measure = $scope.shelf.measure;
        }
        if ($scope.request.measure != $scope.shelf.measure) {
            $scope.isImmediatelyResolvable = false;
            return true;
        }
        var diff = $scope.shelf.storedOriginaly - $scope.shelf.deficit - value;
        if (diff >= 0) {
            $scope.isImmediatelyResolvable = true;
            $scope.request.buy = 0;
            $scope.shelf.stored = $scope.shelf.storedOriginaly - value;
        } else {
            $scope.isImmediatelyResolvable = false;
            $scope.request.buy = -diff;
            $scope.shelf.stored = $scope.shelf.deficit;
        }
        return true;
    };

    $scope.remove = function () {
        if ($window.confirm('Are you sure you want to delete?')) {
            $scope.request.$remove();
            $location.path('request');
        }
    };

    $scope.save = function (isValid) {

        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'requestForm');
            return false;
        }

        $scope.request.measureId = $scope.measure.id;
        $scope.request.shelfId = $scope.shelf.id;
        $scope.request.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);

        function successCallback(res) {
            $location.path('request');
        }

        function errorCallback(res) {
            $scope.error = res.data.message;
        }
    };
}
