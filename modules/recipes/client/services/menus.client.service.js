'use strict';

//Recipes service used for communicating with the recipes REST endpoints
angular.module('recipes').factory('Menu', ['$resource',
  function($resource) {
    return $resource('api/menu/:menuId', {
      recipeId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);