'use strict';

//Shelf service used for communicating with the shelf REST endpoints
angular
    .module('recipes')
    .factory('MealService', MealService);

MealService.$inject = ['$resource'];

function MealService($resource) {
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