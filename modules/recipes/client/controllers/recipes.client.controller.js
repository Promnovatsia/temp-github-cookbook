'use strict';

// Recipes controller
angular.module('recipes').controller('RecipesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes',
  function($scope, $stateParams, $location, Authentication, Recipes) {
    $scope.authentication = Authentication;

      
      $scope.isCollapsed = true;
      
    // Create new Recipe
    $scope.create = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'recipeForm');

        return false;
      }

      // Create new Recipe object
        
        var recipe = new Recipes({
            title: this.title,
            content: this.content,
            action: this.action,
            device: this.device,
            duration: this.duration
        });

      // Redirect after save
      recipe.$save(function(response) {
        $location.path('recipes/' + response.id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Recipe
    $scope.remove = function(recipe) {
      if (recipe) {

        recipe.$remove();
        $location.path('recipes');
      } else {
        $scope.recipe.$remove(function() {
          $location.path('recipes');
        });
      }
    };

    // Update existing Recipe
    $scope.update = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'recipeForm');
        return false;
      }

      var recipe = $scope.recipe;

      recipe.$update(function() {
        $location.path('recipes/' + recipe.id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Recipes
    $scope.find = function() {
      $scope.recipes = Recipes.query();
    };

    // Find existing Recipe
    $scope.findOne = function() {
      $scope.recipe = Recipes.get({
        recipeId: $stateParams.recipeId
      });
    };
  }
]);