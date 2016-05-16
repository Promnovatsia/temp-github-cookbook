'use strict';

// Recipes controller
angular.module('recipes').controller('RecipesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes',
  function($scope, $stateParams, $location, Authentication, Recipes) {
    $scope.authentication = Authentication;
    
     
      $scope.data = [];
    //tree test
        $scope.removeStep = function (node) {          
            $scope.data.splice(node.step.index,1);
            $scope.data.forEach(function(item, i, arr) {
                item.index = i;
            });
        };
        
      $scope.removeExistingStep = function (node) {          
            $scope.recipe.steps.splice(node.step.index,1);
            $scope.recipe.steps.forEach(function(item, i, arr) {
                item.index = i;
            });
        };  
      
      $scope.newStep = function () {
            $scope.data.push({
                'index': $scope.data.length,
                action: 'action ' + ($scope.data.length + 1),
                device: 'device',
                duration: 'duration'
            });
        };
      
      $scope.newExistingStep = function () {
            $scope.recipe.steps.push({
                'index': $scope.recipe.steps.length,
                action: 'action ' + ($scope.recipe.steps.length + 1),
                device: 'device',
                duration: 'duration'
            });
        };
      
      $scope.treeOptionsCreate = {
        dropped : function (e) {
            $scope.data.forEach(function(item, i, arr) {
                item.index = i;
            });
        }
      };
      
      $scope.treeOptionsUpdate = {
        dropped : function (e) {
            $scope.recipe.steps.forEach(function(item, i, arr) {
                item.index = i;
            });
        }
      };
      
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
            steps: this.data
        });

      // Redirect after save
      recipe.$save(function(response) {
        $location.path('recipes/' + response.id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
        $scope.data = [];
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
        //recipe.steps = $scope.data;
        
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