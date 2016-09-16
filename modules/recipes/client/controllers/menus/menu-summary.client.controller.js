'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('MenuSummaryController', MenuSummaryController);
MenuSummaryController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'MenuService','IngredientService', 'MealService'];

function MenuSummaryController($scope, $stateParams, $location, $window, Authentication, MenuService, IngredientService, MealService) {
    
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
                    ingredient.measureDefault = ingredient.ingredientAmount.measureId;
                    ingredient.getMeasure().then(function (measure) {
                        $scope.addIngredientToSum(
                            ingredient.id,
                            ingredient.caption,
                            ingredient.ingredientAmount.amount,
                            measure,
                            meal.portions
                        );
                    });
                });
            });
        });
    };
    
    $scope.addIngredientToSum = function(id, caption, amount, measure, mult) {
        var done = false;
        $scope.summary.forEach(function (ingredient, i, arr) {
            if (ingredient.id === id) {
                ingredient.measures.forEach(function (item, j, arr) {
                    if (item.id === measure.id) {
                        item.amount = item.amount + amount;
                        item.total = +Number(amount * mult).toFixed(3) + (item.total);
                        done = true;
                    }
                });
                if (done) return;
                ingredient.measures.push(
                    {
                        id: measure.id,
                        caption: measure.caption,
                        amount: amount,
                        total: +Number(amount * mult).toFixed(3)  
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
                        total: +Number(amount * mult).toFixed(3)
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