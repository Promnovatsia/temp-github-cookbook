'use strict';

angular
    .module('recipes')
    .controller('ShelfQueryController', ShelfQueryController);

ShelfQueryController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'ShelfQueryService', 'Ingridients', 'Measures'];

function ShelfQueryController($scope, $stateParams, $location, $window, Authentication, ShelfQueryService, Ingridients, Measures) {
        
    $scope.authentication = Authentication;
    $scope.error = null;
    $scope.info = {};
    $scope.form = {};

    $scope.imageurl = 'http://res.cloudinary.com/thomascookbook/image/upload/v1466671927/';
    
    $scope.find = function () {
        ShelfQueryService.query().$promise.then(function (shelfQueries) {
            /*shelfQueries.forEach(function (shelfQuery, i, arr) {
                $scope.progressUpdate(shelf);    
            });*/
            $scope.shelfQueries = shelfQueries;
        });
    };
    
    $scope.findOne = function () {
        if ($stateParams.shelfId && $stateParams.queryId) {
            ShelfQueryService.get(
                {
                    shelfId: $stateParams.shelfId,
                    queryId: $stateParams.queryId
                }
            ).$promise.then(function (shelfQuery) {
                Measures.get(
                    {
                        measureId: shelfQuery.measureId
                    }
                ).$promise.then(function (measure) {
                    $scope.measure = measure;
                });
                $scope.shelfQuery = shelfQuery;
            });    
        } else {
            //TODO new query from other then shelf    
        } 
    };
    
    $scope.remove = function () {
        if ($window.confirm('Are you sure you want to delete?')) {
            $scope.shelfQuery.$remove();
            $location.path('shelfQuery');    
        }
    };

    $scope.save = function (isValid) {
        
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'shelfQueryForm');
            return false;
        }
        
        /*console.log($scope.shelfQuery);
        $scope.shelfQuery.id = $scope.shelfQuery.number; */
        $scope.shelfQuery.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);

        function successCallback(res) {
            $location.path('shelf/' + $scope.shelfQuery.shelfId + '/query');
        }

        function errorCallback(res) {
            $scope.error = res.data.message;
        }
    };
}