'use strict';

//Shelf service used for communicating with the shelf REST endpoints
angular
    .module('recipes')
    .factory('MealService', MealService);

MealService.$inject = ['$resource', 'RecipeService'];

function MealService($resource, RecipeService) {
    var Meal = $resource('api/meal/:mealId', {
        mealId: '@number'
    }, {
        update: {
            method: 'PUT'
        }
    });
    
    angular.extend(Meal.prototype, {
        createOrUpdate: function () {
            var meal = this;
            return createOrUpdate(meal);
        },
        getRecipe: function () {
            var meal = this;
            return getRecipe(meal);
        }
    });
    
    return Meal;
    
    function createOrUpdate(meal) {
        if (meal.id) {
            return meal.$update(onSuccess, onError);
        } else {
            return meal.$save(onSuccess, onError);
        }
    }
    
    function getRecipe(meal) {
        return RecipeService.get(
            {
                recipeId: meal.recipeId
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