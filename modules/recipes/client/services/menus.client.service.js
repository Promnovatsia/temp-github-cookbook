'use strict';

//Shelf service used for communicating with the shelf REST endpoints
angular
    .module('recipes')
    .factory('MenuService', MenuService);

MenuService.$inject = ['$resource', 'ShelfQueryService'];

function MenuService($resource, ShelfQueryService) {
    var Menu = $resource('api/menu/:menuId', {
        menuId: '@number'
    }, {
        update: {
            method: 'PUT'
        }
    });
    
    angular.extend(Menu.prototype, {
        createOrUpdate: function () {
            var menu = this;
            return createOrUpdate(menu);
        },
        getQueries: function () {
            var menu = this;
            return getQueries(menu);
        }
    });
    
    return Menu;
    
    function createOrUpdate(menu) {
        if (menu.id) {
            return menu.$update(onSuccess, onError);
        } else {
            return menu.$save(onSuccess, onError);
        }
    }

    function getQueries(menu) {
        return ShelfQueryService.queryByMenu(
            {
                menuId: menu.id
            }
        ).$promise;
    }
    
    function onSuccess(menu) {
        // Any required internal processing from inside the service, goes here.    
    }
    
    // Handle error response
    function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
    }

    function handleError(error) {
        // Log error
        console.log(error);
    }
}
