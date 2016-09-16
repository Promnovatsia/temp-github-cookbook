'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('MenuWeekplanController', MenuWeekplanController);
MenuWeekplanController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'MenuService', 'MealService'];

function MenuWeekplanController($scope, $stateParams, $location, $window, Authentication, MenuService, MealService) {
    
    $scope.authentication = Authentication;
    $scope.error = null;
    
    $scope.weekDays = [];
    $scope.weekDayExamples = [new Date('2016-08-15'), new Date('2016-08-16'), new Date('2016-08-17'), new Date('2016-08-18'), new Date('2016-08-19'), new Date('2016-08-20'), new Date('2016-08-21')]; //Mon-Sun
    
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
                $scope.meals = menu.meals;
                $scope.menu = menu;
                $scope.menuInitByDays();
                $scope.menu.startDate = new Date(menu.startDate);
            });
        }
    };
    
    $scope.menuInitByDays = function () {
        $scope.unassigned = [];
        $scope.weekDays = [];
        $scope.weekDayExamples.forEach(function (weekDay, i, arr) {
            $scope.weekDays.push(
                {
                    index: i,
                    caption: weekDay
                }
            );
            $scope.weekDays[i].types = [];
            $scope.menu.types.forEach(function (type, j, arr) {
                $scope.weekDays[i].types.push(
                    {
                        index: j,
                        caption: type.caption,
                        serve: type.serve
                    }
                );
                $scope.weekDays[i].types[j].meals = [];
                $scope.meals.forEach(function (meal, k, arr) {
                    if (!meal.done && meal.weekday === i && meal.type === $scope.weekDays[i].types[j].index) {
                        $scope.weekDays[i].types[j].meals.push(meal);
                        meal.done = true;
                    }
                });
            });
        });
        $scope.meals.forEach(function (meal, k, arr) {
            meal = new MealService(meal);
            meal.getRecipe().then(function (recipe) {
                meal.recipe = recipe;
                if (!meal.done) {
                    $scope.unassigned.push(meal);    
                }
            });
        });
    };
    
    $scope.save = function (isValid) {
        
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'menuForm');
            return false;
        }
        
        console.log($scope.menu.meals);
        $scope.weekDayExamples.forEach(function (weekDay, i, arr) {
            $scope.menu.types.forEach(function (type, j, arr) {
                $scope.weekDays[i].types[j].meals.forEach(function (meal, k, arr) {
                    meal.type = type.index;
                    meal.weekday = weekDay.index;
                });
            });
        });
        $scope.unassigned.forEach(function (meal, i, arr) {
            meal.weekday = -1;   
        });
        console.log($scope.menu);
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