'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('MenuMealsController', MenuMealsController);
MenuMealsController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'MenuService','RecipeService', 'MealService'];

function MenuMealsController($scope, $stateParams, $location, $window, Authentication, MenuService, RecipeService, MealService) {
    
    $scope.authentication = Authentication;
    $scope.error = null;
    $scope.form = {};
    $scope.recipeList = [];
    
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
                $scope.menu.startDate = new Date(menu.startDate);
                $scope.assignMeals();
            });
        }
    };
    
    $scope.getRecipes = function (value) {
        var matched = [];
        if ($scope.recipeList.length === 0) {
            return RecipeService.query().$promise.then(function (results) { //FUTURE уменьшить загрузку через поиск БД
                $scope.recipeList = results;
                results.forEach(function (item, i, arr) {
                    if (item.title.includes(value)) {
                        matched.push(item);
                    }
                });
                return matched;
            });
        } else {
            $scope.recipeList.forEach(function (item, i, arr) {
                if (item.title.includes(value)) {
                    matched.push(item);
                }
            });
            return matched;
        }
    };
    
    /*$scope.getRecipes = function (value) {
        return RecipeService.query(
            {
                recipeSearchTitle: value
            }
        ).$promise.then(function (results) {
            return results;
        });
    };search by param*/
    
    $scope.addRecipe = function (recipe) {
        var meal = new MealService(
            {
                index: $scope.menu.meals.length,
                recipeId: recipe.id,
                weekday: -1,
                type: -1,
                portions: recipe.portions,
                recipe: recipe
            }
        );
        $scope.menu.meals.push(meal);
        $scope.form.unassigned.push(meal);
        $scope.asyncSelected = "";
    };
    
    $scope.assignMeals = function () {
        $scope.form.unassigned = [];
        $scope.form.types = [];
        $scope.menu.types.forEach(function (item, i, arr) {
            $scope.form.types.push(
                {
                    caption: item.caption,
                    meals: []
                }
            );
        });
        $scope.menu.meals.forEach(function (item, i, arr) {
            item = new MealService(item);
            item.getRecipe().then(function (recipe) {
                item.recipe = recipe;
                if (item.type === -1 || item.type >= $scope.form.types.length) {
                    $scope.form.unassigned.push(item);
                } else if($scope.form.types[item.type]) {
                    $scope.form.types[item.type].meals.push(item);
                }
            });
        });
    };
    
    $scope.save = function (isValid) {
        
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'menuForm');
            return false;
        }
        
        $scope.form.types.forEach(function (type, i, arr) {
            type.meals.forEach(function (meal, j, arr) {
                meal.type = i;
                meal.recipe = undefined;
            });
        });
        
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