'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('MenuRecipesController', MenuRecipesController);
MenuRecipesController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'MenuService', 'ShelfQueryService', 'Recipes', 'Measures'];

function MenuRecipesController($scope, $stateParams, $location, $window, Authentication, MenuService, ShelfQueryService, Recipes, Measures) {
    
    $scope.authentication = Authentication;
    $scope.error = null;
    $scope.info = {};
    $scope.form = {};
    
    $scope.find = function () {
        MenuService.query().$promise.then(function (menus) {
            $scope.menus = menus;
        });
    };
    
    $scope.findOne = function () {
        if ($stateParams.menuId) {
            MenuService.get(
                {
                    menuId: $stateParams.menuId
                }
            ).$promise.then(function (menu) {
                if (menu.meals) {
                    menu.meals.forEach(function (item, i, arr) {
                        item.recipe = $scope.getRecipe(item.recipeId);
                    });
                }
                $scope.menu = menu;
                $scope.menu.startDate = new Date(menu.startDate);
            });
        }
    };
    
    $scope.getRecipe = function (id) {
        return Recipes.get(
            {
                recipeId: id
            }
        );
    };
    
    $scope.getMeasures = function (recipe) {
        if (recipe.ingridients.length > 0) {
            recipe.ingridients.forEach(function (item, i, arr) {
                Measures.get(
                    {
                        measureId: item.ingridientAmount.measureId
                    }
                ).$promise.then(function (measure) {
                    item.measure = measure;
                });
            });
        }
    };
    
    $scope.addRecipe = function (id) {
        Recipes.get(
            {
                recipeId: id
            }
        ).$promise.then(function (recipe) {
            $scope.menu.meals.push(
                {
                    recipeId: recipe.id,
                    recipe: recipe,
                    index: $scope.meals.length,
                    portions: recipe.portions
                }
            );
        });
    };
    
    $scope.remove = function () {
        if ($window.confirm('Are you sure you want to delete?')) {
            $scope.menu.$remove();
            $location.path('menu');
        }
    };

    $scope.save = function (isValid) {
        
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'menuForm');
            return false;
        }
        
        $scope.menu.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);

        function successCallback(res) {
            $location.path('menu/' + $scope.menu.number);
        }

        function errorCallback(res) {
            $scope.error = res.data.message;
        }
    };
}