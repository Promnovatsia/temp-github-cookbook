'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('MenuInitController', MenuInitController);
MenuInitController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'MenuService'];

function MenuInitController($scope, $stateParams, $location, $window, Authentication, MenuService) {
    
    $scope.authentication = Authentication;
    $scope.error = null;
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
                $scope.menu = menu;
                $scope.menu.startDate = new Date(menu.startDate);
            });    
        } else {
            $scope.menu = new MenuService(
                {
                    startDate: new Date(Date.now()),
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
        }
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
    };
    
    $scope.removeType = function (typeIndex) {
        $scope.menu.types.splice(typeIndex, 1);
        $scope.menuInitByDays($scope.menu);
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
            $location.path('menu/' + $scope.menu.number + '/meals');
        }

        function errorCallback(res) {
            $scope.error = res.data.message;
        }
    };
}