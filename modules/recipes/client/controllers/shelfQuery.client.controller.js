'use strict';

angular
    .module('recipes')
    .controller('ShelfQueryController', ShelfQueryController);

ShelfQueryController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'ShelfQueryService', 'Ingridients', 'Measures'];

function ShelfQueryController($scope, $stateParams, $location, $window, Authentication, ShelfQueryService, Ingridients, Measures) {
        
    $scope.authentication = Authentication;
    $scope.error = null;

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
        if ($stateParams.shelfQueryId) {
            ShelfQueryService.get(
                {
                    shelfQueryId: $stateParams.shelfQueryId
                }
            ).$promise.then(function (shelfQuery) {
                $scope.shelfQuery = shelfQuery;
                /*$scope.spoilUpdate(shelf.isSpoiled);
                if (shelf.ingridientId) {
                    $scope.setIngridient(shelf.ingridientId);        
                }*/
            });    
        } else {
            
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
        
        /*$scope.shelf.caption = $scope.info.caption;
        $scope.shelf.measureCaption = $scope.info.measure;*/
        $scope.shelfQuery.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);

        function successCallback(res) {
            $location.path('shelfQuery/' + $scope.shelfQuery.id);
        }

        function errorCallback(res) {
            $scope.error = res.data.message;
        }
    };
}