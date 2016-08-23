'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('MenusController', MenusController);
MenusController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'MenuService', 'ShelfQueryService', 'Recipes', 'Measures'];

function MenusController($scope, $stateParams, $location, $window, Authentication, MenuService, ShelfQueryService, Recipes, Measures) {
    
    $scope.authentication = Authentication;
    $scope.error = null;
    $scope.info = {};
    $scope.form = {};
    $scope.mytime = Date.now();
    
    $scope.weekDays = [];
    $scope.weekDayMask = [true, true, true, true, true, true, false];
    $scope.weekDayExamples = [new Date('2016-08-15'), new Date('2016-08-16'), new Date('2016-08-17'), new Date('2016-08-18'), new Date('2016-08-19'), new Date('2016-08-20'), new Date('2016-08-21')]; //Mon-Sun
    $scope.meals = [
        {
            recipeId: 1,
            index: 0,
            type: 0,
            weekday: 0,
            portions: 2,
            comment: 'test meal 1',
            isDone: false,
            startTime: 16 * 60 //16:00
        },
        {   
            recipeId: 1,
            index: 1,
            type: 0,
            weekday: 2,
            portions: 2.5,
            comment: 'test meal 2',
            isDone: true,
            startTime: 17 * 60 + 30 //17:30
        },
        {   
            recipeId: 1,
            index: 2,
            type: 1,
            weekday: 2,
            portions: 2.5,
            comment: 'test meal 2 - double',
            isDone: true,
            startTime: 17 * 60 + 30 //17:30
        },
        {   
            recipeId: 1,
            index: 3,
            type: 0,
            weekday: 2,
            portions: 2.5,
            comment: 'test meal 3',
            isDone: true,
            startTime: 17 * 60 + 30 //17:30
        },
        {   
            recipeId: 1,
            index: 4,
            type: 1,
            weekday: 3,
            portions: 2.5,
            comment: 'test meal 2',
            isDone: true,
            startTime: 17 * 60 + 30 //17:30
        }
    ];
    
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
                $scope.menuInitByDays(menu);
                $scope.menu = menu;
                $scope.menu.startDate = new Date(menu.startDate);
            });    
        } else {
            $scope.menu = new MenuService(
                {
                    startDate: Date.now(),
                    types: [
                        {
                            index: 0,
                            caption: "Завтрак",
                            serve: new Date('2016-08-15 7:30')
                        },
                        {
                            index: 1,
                            caption: "Обед",
                            serve: new Date('2016-08-15 19:30')
                        }
                    ]
                }
            );
            $scope.menuInitByDays($scope.menu);
        }
    };
    
    $scope.findQueryForMenu = function () {
        ShelfQueryService.query(
            {
                menuId: $stateParams.menuId
            }
        ).$promise.then(function (shelfQueries) {
            $scope.shelfQueries = shelfQueries;
        });
    };
    
    $scope.menuInitByDays = function (menu) {
        $scope.weekDays = [];
        $scope.weekDayMask.forEach(function (weekDay, i, arr) {
            if (!weekDay) {
                $scope.weekDays.push(
                    {
                        index: i,
                        isActive: false,
                        caption: $scope.weekDayExamples[i]
                    }
                );
            } else {
                $scope.weekDays.push(
                    {
                        index: i,
                        isActive: true,
                        caption: $scope.weekDayExamples[i]
                    }
                );
            }
            $scope.weekDays[i].types = [];
            menu.types.forEach(function (type, j, arr) {
                $scope.weekDays[i].types.push(
                    {
                        index: j,
                        caption: type.caption,
                        serve: type.serve
                    }
                );
                $scope.weekDays[i].types[j].meals = [];
                $scope.meals.forEach(function (meal, k, arr) {
                    if (meal.weekday === i && meal.type === $scope.weekDays[i].types[j].index) {
                        $scope.weekDays[i].types[j].meals.push(meal);
                        $scope.weekDays[i].types[j].meals[$scope.weekDays[i].types[j].meals.length - 1].index = k;
                    }
                });
            });
        });
        $scope.form.newType = {
            isShown: false,
            caption: null,
            serve: menu.types[menu.types.length - 1].serve
        };
    };
    
    $scope.addType = function () {
        $scope.menu.types.push(
            {
                index: $scope.menu.types[$scope.menu.types.length - 1].index + 1, 
                caption: $scope.form.newType.caption,
                serve: $scope.form.newType.serve
            }
        );
        $scope.form.newType = {
            isShown: false,
            caption: null,
            serve: $scope.menu.types[$scope.menu.types.length - 1].serve
        };
        $scope.menuInitByDays($scope.menu);
    };
    
    $scope.removeType = function (typeIndex) {
        $scope.menu.types.splice(typeIndex, 1);
        $scope.menuInitByDays($scope.menu);
    };
    
    $scope.addMeal = function (weekday, typeIndex) {
        $scope.meals.push(
            { 
                recipeId: 1,
                index: $scope.meals.length,
                type: typeIndex,
                weekday: weekday,
                portions: 2.5,
                comment: 'test meal 2',
                isDone: false,
                startTime: 17 * 60 + 30 //17:30
            } 
        );
        $scope.menuInitByDays($scope.menu);
    };
    
    $scope.mealMoveType = function (oldType, meal, direction) {
        
        var targetIndex = -1;
        $scope.weekDays[meal.weekday].types.some(function (type) {
            if (direction < 0) {
                if (type.serve >= oldType.serve)
                    return true;
                targetIndex = type.index;
            } else {
                targetIndex = type.index;
                if (type.serve > oldType.serve)
                    return true;    
            }
            return false;
        });
        if (targetIndex === -1) return;
        
        $scope.meals[meal.index].type = $scope.weekDays[meal.weekday].types[targetIndex].index;
        $scope.menuInitByDays($scope.menu);
    };
    
    $scope.mealMoveDay = function (meal, direction) {
        if (direction < 0) {
            if (meal.weekday > 0)
                meal.weekday = meal.weekday - 1;
            else 
                return;
        } else {
            if (meal.weekday < 6)
                meal.weekday = meal.weekday + 1;
            else 
                return;
        }
        $scope.meals[meal.index].weekday = meal.weekday;
        $scope.menuInitByDays($scope.menu);
    };
    
    $scope.getLocation = function (val) {
        return Recipes.query().$promise.then(function (results) {
            return results.map(function (item) {
                return {
                    id: item.id,
                    caption: item.title
                };
            });
        });
    };
    
    $scope.addRecipe = function (id) {
        Recipes.get(
            {
                recipeId: id
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
            $scope.recipe = recipe;
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
        
        console.log($scope.menu.meals);
        $scope.menu.meals = [];
        $scope.meals.forEach(function (meal, k, arr) {
             $scope.menu.meals.push(meal);    
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