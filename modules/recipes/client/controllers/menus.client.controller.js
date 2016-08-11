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
                            caption: "dinner",
                            serve: 19 * 60 + 30 //19:30
                        }
                    ]
                }
            );
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