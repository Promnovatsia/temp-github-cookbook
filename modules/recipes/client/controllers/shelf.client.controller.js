'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('ShelfController', ShelfController);
ShelfController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Ingridients', 'Measures', 'Shelf'];
function ShelfController($scope, $stateParams, $location, $window, Authentication, Ingridients, Measures, Shelf) {

    $scope.authentication = Authentication;

    $scope.find = function () {
        $scope.ingridients = Ingridients.query();
    };

    $scope.findOne = function () {
        $scope.ingridient = Ingridients.get(
            {
                ingridientId: $stateParams.ingridientId
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

        var shelf = new Ingridients(
            {
                caption: this.caption,
                infoCard: this.infoCard,
                image: $scope.imageURL,
                measureDefault: $scope.measureDefault
            }
        );

        // Redirect after save
        shelf.$save(function (response) {
            $location.path('ingridients/' + response.id);

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

        var ingridient = $scope.ingridient;
        ingridient.image = $scope.imageURL;
        ingridient.$update(function () {
            $location.path('ingridients/' + ingridient.id);
        }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
        });
    };

    $scope.remove = function (ingridient) {
        if (ingridient) {
            ingridient.$remove();
            $location.path('ingridients');
        } else {
            $scope.ingridient.$remove(function () {
                $location.path('ingridient');
            });
        }
    };

}