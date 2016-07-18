'use strict';

angular
    .module('recipes')
    .controller('ShelfController', ShelfController);

ShelfController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'ShelfService'];

function ShelfController($scope, $stateParams, $location, $window, Authentication, ShelfService) {

    $scope.authentication = Authentication;
    $scope.error = null;
    
    $scope.find = function () {
        $scope.shelves = ShelfService.query();
    };
    
    $scope.findOne = function () {
        console.log($stateParams);
        if ($stateParams.shelfId) {
            $scope.shelf = ShelfService.get(
                {
                    shelfId: $stateParams.shelfId
                }
            );    
        } else {
            $scope.shelf = new ShelfService(
                {
                    stored: 1,
                    desired: 2,
                    max: 3,
                    deficit: 0
                }
            );     
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
        console.log("save");
        $scope.shelf.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);


        function successCallback(res) {
            console.log("success");
            $location.path('shelf/' + $scope.shelf.id);
        }

        function errorCallback(res) {
            $scope.error = res.data.message;
        }
    };
}