'use strict';

//Ingredients service used for communicating with the Ingredients REST endpoints
angular
    .module('recipes')
    .factory('IngredientService', IngredientService);

IngredientService.$inject = ['$resource', 'ShelfService'];

function IngredientService($resource, ShelfService) {
    var Ingredient = $resource('api/ingridients/:ingredientId', { //TODO i to e
        ingredientId: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
    
    angular.extend(Ingredient.prototype, {
        createOrUpdate: function () {
            var ingredient = this;
            return createOrUpdate(ingredient);
        },
        getShelf: function () {
            var ingredient = this;
            return getShelf(ingredient);
        }
    });
    
    return Ingredient;
    
    function createOrUpdate(ingredient) {
        if (ingredient.id) {
            return ingredient.$update(onSuccess, onError);
        } else {
            return ingredient.$save(onSuccess, onError);
        }
    }
    
    function getShelf(ingredient) {
        return ShelfService.get(
            {
                ingredientId: ingredient.id
            }
        ).$promise;
    }
    
    function onSuccess(ingredient) {
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