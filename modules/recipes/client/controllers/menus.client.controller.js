'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('MenusController', MenusController);
MenusController.$inject = ['$scope', '$stateParams', '$location', 'Authentication', 'Menu', 'Recipes', 'Ingridients', 'Measures'];

function MenusController($scope, $stateParams, $location, Authentication, Recipes, Ingridients, Measures) {

    $scope.authentication = Authentication;

    $scope.sort = function (a, b) {
        return a.index - b.index;
    };

// Find a list of Recipes
    $scope.find = function () {
        $scope.recipes = Recipes.query();
    };

// Find existing Recipe
    $scope.findOne = function () {
        Recipes.get(
            {
                recipeId: $stateParams.recipeId
            }
        ).$promise.then(function (recipe) {
            if (recipe.ingridients.length > 0) {
                recipe.ingridients.forEach(function (item, i, arr) {
                    Measures.get(
                        {
                            measureId: item.ingridientAmount.measureId
                        }
                    ).$promise.then(function (measure) {
                        item.measure = measure;
                        item.index = item.ingridientAmount.index;
                        item.amount = item.ingridientAmount.amount;
                        item.measureCaption = measure.caption;
                    });
                });
            }
            recipe.ingridients.sort($scope.sort);
            $scope.recipe = recipe;
            $scope.ingridientData = $scope.recipe.ingridients;
        });
    };

// Update existing Recipe
    $scope.update = function (isValid) {
        $scope.error = null;

        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'recipeForm');
            return false;
        }

        var recipe = $scope.recipe;
        recipe.ingridients = $scope.ingridientData;
        recipe.steps = $scope.stepData;
        recipe.$update(function () {
            $location.path('recipes/' + recipe.id);
        }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
        });
    };

    // Remove existing Recipe
    $scope.remove = function (recipe) {
        if (recipe) {
            recipe.$remove();
            $location.path('recipes');
        } else {
            $scope.recipe.$remove(function () {
                $location.path('recipes');
            });
        }
    };

}