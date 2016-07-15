'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('ShelfController', ShelfController);
ShelfController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Ingridients', 'Measures', 'Shelf'];
function ShelfController($scope, $stateParams, $location, $window, Authentication, Ingridients, Measures, Shelf) {

    $scope.authentication = Authentication;

    $scope.find = function () {
        $scope.shelves = Shelf.query();
    };

    $scope.findOne = function () {
        $scope.shelf = Shelf.get(
            {
                shelfId: $stateParams.shelfId
            }
        );
    };

    $scope.getMeasuresList = function () {
        return Measures.query().$promise;
    };

    $scope.create = function (isValid) {
        $scope.error = null;

        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'ingridientForm');
            return false;
        }

        // Create new Shelf object

        var shelf = new Shelf(
            {}
        );

        // Redirect after save
        shelf.$save(function (response) {
            $location.path('shelf/' + response.id);

        // Clear form fields
            $scope.caption = '';
            $scope.infoCard = '';
        }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
        });
    };

    $scope.update = function (isValid) {
        $scope.error = null;
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'ingridientForm');
            return false;
        }

        var shelf = $scope.shelf;
        shelf.image = $scope.imageURL;
        shelf.$update(function () {
            $location.path('shelf/' + shelf.id);
        }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
        });
    };

    $scope.remove = function (shelf) {
        if (shelf) {
            shelf.$remove();
            $location.path('shelf');
        } else {
            $scope.shelf.$remove(function () {
                $location.path('shelf');
            });
        }
    };

}