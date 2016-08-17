'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('MenusController', MenusController);
MenusController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'MenuService', 'ShelfQueryService'];

function MenusController($scope, $stateParams, $location, $window, Authentication, MenuService, ShelfQueryService) {
    
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
            type: 'Обед',
            weekday: 0,
            portions: 2,
            comment: 'test meal 1',
            isDone: false,
            startTime: 16 * 60 //16:00
        },
        {   
            type: 'Обед',
            weekday: 2,
            portions: 2.5,
            comment: 'test meal 2',
            isDone: true,
            startTime: 17 * 60 + 30 //17:30
        },
        {   
            type: 'Обед',
            weekday: 2,
            portions: 2.5,
            comment: 'test meal 2 - double',
            isDone: true,
            startTime: 17 * 60 + 30 //17:30
        },
        {   
            type: 'Завтрак',
            weekday: 2,
            portions: 2.5,
            comment: 'test meal 3',
            isDone: true,
            startTime: 17 * 60 + 30 //17:30
        },
        {   
            type: 'Завтрак',
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
                $scope.menuInitByDays(menu);
                $scope.menu = menu;
            });    
        } else {
            $scope.menu = new MenuService(
                {
                    startDate: Date.now(),
                    types: [
                        {
                            caption: "Завтрак",
                            serve: new Date('2016-08-15 7:30')
                        },
                        {
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
        menu.weekDays = [];
        $scope.weekDayMask.forEach(function (weekDay, i, arr) {
            if (!weekDay) {
                menu.weekDays.push(
                    {
                        index: i,
                        isActive: false,
                        caption: $scope.weekDayExamples[i]
                    }
                );
            } else {
                menu.weekDays.push(
                    {
                        index: i,
                        isActive: true,
                        caption: $scope.weekDayExamples[i]
                    }
                );
                menu.weekDays[i].types = [];
                menu.types.forEach(function (type, j, arr) {
                    menu.weekDays[i].types.push(
                        {
                            index: j,
                            caption: type.caption,
                            serveTime: type.serve
                        }
                    );
                    menu.weekDays[i].types[j].meals = [];
                    $scope.meals.forEach(function (meal, k, arr) {
                        if (meal.weekday === i && meal.type === menu.weekDays[i].types[j].caption) {
                            menu.weekDays[i].types[j].meals.push(meal);    
                        }    
                    });
                });
            }
        });    
    };
    
    $scope.addType = function () {
        $scope.menu.types.push(
            {
                caption: "Новый прием пищи",
                serve: new Date('2016-08-15 12:00')    
            }
        );        
    };
    
    $scope.removeType = function (type) {
        $scope.menu.types.splice($scope.menu.types.indexOf(type), 1);    
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