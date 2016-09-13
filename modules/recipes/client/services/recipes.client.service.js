'use strict';

//Recipes service used for communicating with the recipes REST endpoints
angular.module('recipes').factory('Recipes', ['$resource',
  function($resource) {
    return $resource('api/recipes/:recipeId', {
      recipeId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//Recipe service used for communicating with the recipe REST endpoints
angular
    .module('recipes')
    .factory('RecipeService', RecipeService);

RecipeService.$inject = ['$resource'];

function RecipeService($resource) {
    var Recipe = $resource('api/recipes/:recipeId', {
        recipeId: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
    
    angular.extend(Recipe.prototype, {
        createOrUpdate: function () {
            var recipe = this;
            return createOrUpdate(recipe);
        }
    });
    
    return Recipe;
    
    function createOrUpdate(recipe) {
        if (recipe.id) {
            return recipe.$update(onSuccess, onError);
        } else {
            return recipe.$save(onSuccess, onError);
        }
    }
    
    function onSuccess(recipe) {
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