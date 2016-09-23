'use strict';

angular
    .module('recipes')
    .controller('RequestController', RequestController);

RequestController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'RequestService', 'MeasureService'];

function RequestController($scope, $stateParams, $location, $window, Authentication, RequestService, MeasureService) {

    $scope.authentication = Authentication;
    $scope.error = null;

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
                    MeasureService.get(
                        {
                            measureId: request.measureId
                        }
                    ).$promise.then(function (measure) {
                        $scope.measure = measure;
                    });
                }
                if (request.shelfId) {
                    request.getShelf().then(function (shelf) {
                        if (shelf.id) {
                            $scope.shelf = shelf;
                            MeasureService.get(
                                {
                                    measureId: shelf.measureId
                                }
                            ).$promise.then(function (measure) {
                                $scope.shelf.measure = measure;
                            });
                        }
                    });
                }
                $scope.request = request;
            });
        } else {
            $scope.request = new RequestService(
                {
                    createdAt: Date.now()
                }
            );
        }
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
