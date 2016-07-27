'use strict';

angular
    .module('recipes')
    .controller('ShelfQueryController', ShelfQueryController);

ShelfQueryController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'ShelfService', 'Ingridients', 'Measures'];

function ShelfQueryController($scope, $stateParams, $location, $window, Authentication, ShelfService, Ingridients, Measures) {
        
    $scope.authentication = Authentication;
    $scope.error = null;

    $scope.imageurl = 'http://res.cloudinary.com/thomascookbook/image/upload/v1466671927/';
    
    $scope.find = function () {
        ShelfService.query().$promise.then(function (shelves) {
            shelves.forEach(function (shelf, i, arr) {
                $scope.progressUpdate(shelf);    
            });
            $scope.shelves = shelves;
        });
    };
    
    $scope.findOne = function () {
        if ($stateParams.shelfId) {
            ShelfService.get(
                {
                    shelfId: $stateParams.shelfId
                }
            ).$promise.then(function (shelf) {
                $scope.shelf = shelf;
                $scope.spoilUpdate(shelf.isSpoiled);
                if (shelf.ingridientId) {
                    $scope.setIngridient(shelf.ingridientId);        
                }
            });    
        } else {
            
        } 
    };
    
    $scope.remove = function () {
        if ($window.confirm('Are you sure you want to delete?')) {
            $scope.shelf.$remove();
            $location.path('shelf');    
        }
    };

    $scope.save = function (isValid) {
        
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'shelfForm');
            return false;
        }
        
        $scope.shelf.caption = $scope.info.caption;
        $scope.shelf.measureCaption = $scope.info.measure;
        $scope.shelf.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);

        function successCallback(res) {
            $location.path('shelf/' + $scope.shelf.id);
        }

        function errorCallback(res) {
            $scope.error = res.data.message;
        }
    };
}