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
    
    $scope.weekDayMask = [true, true, true, true, true, true, false];
    $scope.weekDayCaptions = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];//TODO replace with week const from Date
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
                $scope.menu = menu;
            });    
        } else {
            $scope.menu = new MenuService(
                {
                    startDate: Date.now(),
                    types: [
                        {
                            caption: "Завтрак",
                            serve: "7:15"
                        },
                        {
                            caption: "Обед",
                            serve: "19:30"
                        }
                    ],
                    weekDays: []
                }
            );
        } 
        $scope.menuInitByDays();
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
    
    $scope.menuInitByDays = function () {
        $scope.menu.weekDays = [];
        $scope.weekDayMask.forEach(function (weekDay, i, arr) {
            if (!weekDay) {
                $scope.menu.weekDays.push(
                    {
                        index: i,
                        isActive: false,
                        caption: $scope.weekDayCaptions[i]
                    }
                );
            } else {
                $scope.menu.weekDays.push(
                    {
                        index: i,
                        isActive: true,
                        caption: $scope.weekDayCaptions[i]
                    }
                );
                $scope.menu.weekDays[i].types = [];
                $scope.menu.types.forEach(function (type, j, arr) {
                    $scope.menu.weekDays[i].types.push(
                        {
                            index: j,
                            caption: type.caption,
                            serveTime: type.serve
                        }
                    );
                    $scope.menu.weekDays[i].types[j].meals = [];
                    $scope.meals.forEach(function (meal, k, arr) {
                        if (meal.weekday === i && meal.type === $scope.menu.weekDays[i].types[j].caption) {
                            $scope.menu.weekDays[i].types[j].meals.push(meal);    
                        }    
                    });
                });
            }
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