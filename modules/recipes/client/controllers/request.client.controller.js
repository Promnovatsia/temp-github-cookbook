'use strict';

angular
    .module('recipes')
    .controller('RequestController', RequestController);

RequestController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'RequestService', 'ShelfService', 'MeasureService'];

function RequestController($scope, $stateParams, $location, $window, Authentication, RequestService, ShelfService, MeasureService) {

    $scope.authentication = Authentication;
    $scope.error = null;
    $scope.asyncShelves = [];
    $scope.asyncMeasures = [];

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
                if (request.measureId) {
                    request.getMeasure().then(function (measure) {
                        $scope.measure = measure;
                    });
                }
                if (request.shelfId) {
                    request.getShelf().then(function (shelf) {
                        if (shelf.id) {
                            shelf.getMeasure().then(function (measure) {
                                $scope.shelf = shelf;
                                $scope.shelf.measure = measure;
                            });
                        }
                    });
                }
                $scope.request = request;
                $scope.request.buy = request.buy || 1;
                $scope.request.buyDate = request.buyDate ? new Date(request.buyDate) : Date.now();
            });
        } else {
            $scope.request = new RequestService(
                {
                    createdAt: Date.now(),
                    buy: 1,
                    buyDate: Date.now()
                }
            );
        }
    };

    $scope.getAsyncShelves = function (value) {
        var matched = [];
        if ($scope.asyncShelves.length === 0) {
            return ShelfService.query().$promise.then(function (results) { //TODO уменьшить загрузку через поиск БД
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
        shelf.getMeasure().then(function (measure) {
            $scope.shelf = shelf;
            $scope.shelf.measure = measure;
        });
    };

    $scope.clearAsyncShelf = function () {
        $scope.asyncShelf = '';
        $scope.asyncShelves = [];
    };

    $scope.getAsyncMeasures = function (value) {
        var matched = [];
        if ($scope.asyncMeasures.length === 0) {
            return MeasureService.query().$promise.then(function (results) { //TODO уменьшить загрузку через поиск БД
                $scope.asyncMeasures = results;
                results.forEach(function (item, i, arr) {
                    if (item.caption.includes(value)) {
                        matched.push(item);
                    }
                });
                return matched;
            });
        } else {
            $scope.asyncMeasures.forEach(function (item, i, arr) {
                if (item.caption.includes(value)) {
                    matched.push(item);
                }
            });
            return matched;
        }
    };

    $scope.selectMeasure = function (measure) {
        $scope.measure = measure;
    };

    $scope.clearAsyncMeasure = function () {
        $scope.asyncMeasure = '';
        $scope.asyncMeasures = [];
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
