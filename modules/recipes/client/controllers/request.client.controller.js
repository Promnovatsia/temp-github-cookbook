'use strict';

angular
    .module('recipes')
    .controller('RequestController', RequestController);

RequestController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'RequestService', 'ShelfService'];

function RequestController($scope, $stateParams, $location, $window, Authentication, RequestService, ShelfService) {

    $scope.authentication = Authentication;
    $scope.error = null;
    $scope.asyncShelves = [];
    $scope.asyncMeasures = []; //required by measureSelectCard directive
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
                $scope.request = request;
                $scope.request.needed = (request.buy > 0) ? request.buy - request.requested : 0;
                $scope.request.buyDate = request.buyDate ? new Date(request.buyDate) : new Date(Date.now());
                $scope.request.getMeasure();
                var a = request.getShelf();
                if (a) {
                    a.then(function (shelf) {
                        $scope.shelf = shelf;
                        $scope.shelf.storedOriginaly = $scope.shelf.stored;
                        $scope.shelf.getMeasure().then(function () {
                            $scope.checkRequest(null, $scope.request.needed, 0);
                        });
                    });
                }
            });
        } else {
            var newdate = new Date(Date.now());
            $scope.request = new RequestService(
                {
                    createdAt: newdate,
                    buyDate: newdate,
                    requested: 0
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
        $scope.shelf.stored = $scope.shelf.storedOriginaly;
        $scope.request.requested = $scope.request.measure.min;
        $scope.request.buy = 0;
        $scope.checkRequest(null, 0, $scope.request.requested);
    };

    $scope.checkRequest = function (id, value, oldValue) {
        if (!$scope.shelf) {
            return false;
        }
        if ($scope.request.measure.id !== $scope.shelf.measure.id) {
            $scope.shelf.stored = $scope.shelf.storedOriginaly - $scope.request.requested;
            $scope.isImmediatelyResolvable = false;
            return true;
        }
        var diff = $scope.shelf.storedOriginaly - $scope.shelf.deficit - $scope.request.requested - value;
        if (diff >= 0) {
            $scope.isImmediatelyResolvable = true;
            $scope.shelf.stored = $scope.shelf.storedOriginaly - $scope.request.requested - value;
            $scope.request.buy = 0;
        } else {
            $scope.isImmediatelyResolvable = false;
            $scope.shelf.stored = $scope.shelf.deficit;
            $scope.request.buy = -diff;
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

        $scope.request.measureId = $scope.request.measure.id;
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
