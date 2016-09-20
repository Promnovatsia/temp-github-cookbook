'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('MenuSummaryController', MenuSummaryController);
MenuSummaryController.$inject = ['$scope', '$stateParams', '$location', 'Authentication', 'MenuService','IngredientService', 'MealService'];

function MenuSummaryController($scope, $stateParams, $location, Authentication, MenuService, IngredientService, MealService) {
    
    $scope.authentication = Authentication;
    $scope.error = null;
    $scope.form = {};
    
    $scope.find = function () {
        MenuService.query().$promise.then(function (menus) {
            $scope.menus = menus;
        });
    };
    
    $scope.findOne = function () {//TODO pass object via param
        if ($stateParams.menuId) {
            MenuService.get(
                {
                    menuId: $stateParams.menuId
                }
            ).$promise.then(function (menu) {
                $scope.menu = menu;
                $scope.ingredientSummary();
                $scope.menu.startDate = new Date(menu.startDate);
            });
        }
    };
    
    
    $scope.ingredientSummary = function () {
        $scope.summary = [];
        $scope.menu.meals.forEach(function (meal, i, arr) {
            meal = new MealService(meal);
            meal.getRecipe().then(function (recipe) {
                meal.recipe = recipe;
                recipe.ingredients.forEach(function (ingredient, j, arr) {
                    ingredient = new IngredientService(ingredient);
                    ingredient.amount = ingredient.ingredientAmount.amount;
                    ingredient.measureDefault = ingredient.ingredientAmount.measureId;
                    ingredient.getShelf().then(function (shelf) {
                        ingredient.shelf = shelf;
                    });
                    ingredient.getMeasure().then(function (measure) {
                        $scope.addIngredientToSum(
                            ingredient,
                            measure,
                            meal.portions,
                            recipe.portions
                        );
                    });
                });
            });
        });
    };
    
    $scope.addIngredientToSum = function(ingredient, measure, mealPortions, recipePortions) {
        var done = false,
            id = ingredient.id,
            caption = ingredient.caption,
            amount = ingredient.amount,
            total = +Number(amount / recipePortions * mealPortions).toFixed(3);
        $scope.summary.forEach(function (ingredient, i, arr) {
            if (ingredient.id === id) {
                ingredient.measures.forEach(function (item, j, arr) {
                    if (item.id === measure.id) {
                        item.amount = item.amount + amount;
                        item.total = total + (item.total);
                        done = true;
                    }
                });
                if (done) return;
                ingredient.measures.push(
                    {
                        id: measure.id,
                        caption: measure.caption,
                        amount: amount,
                        total: total
                    }
                );
                done = true;
            } 
        });
        if (done) return;
        $scope.summary.push(
            {
                id: id,
                caption: caption,
                measures: [
                    {
                        id: measure.id,
                        caption: measure.caption,
                        amount: amount,
                        total: total
                    }
                ]
            }
        );
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
            $location.path('menu/' + $scope.menu.number + '/weekplan');
        }

        function errorCallback(res) {
            $scope.error = res.data.message;
        }
    };
}
