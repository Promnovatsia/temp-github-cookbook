'use strict';

// Recipes controller
angular.module('recipes').controller('RecipesController', 
                                     ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes','Ingridients',
    function($scope, $stateParams, $location, Authentication, Recipes, Ingridients) {
        
        $scope.authentication = Authentication;      

//Igridients
      
        $scope.searchIngridient = false;
    $scope.ingridientData = [];
        
        $scope.getIngridientList = function() {
            return Ingridients.query().$promise;
        };
        
        //$scope.ingridientList = $scope.getIngridientList();
        
        
    //create view
        
        $scope.treeIngridientsCreate = {
            dropped : function (e) {
                $scope.ingridientData.forEach(function(item, i, arr) {
                    item.index = i;
                });
            }
        };
        
        $scope.newIngridient = function () {
            $scope.searchIngridient = false;
        };
        
        $scope.newIngridientPush = function(index) {
            Ingridients.get({
                ingridientId: index
            }).$promise.then(function(res){
                console.log(res);
                $scope.ingridientData.push({
                    'index': $scope.ingridientData.length,
                    caption: res.caption,
                    infoCard: res.infoCard,
                    amount: 1,
                    measure: 'item',
                    isPopover: false
            });
                return res;
            });            
        };
        
        $scope.removeIngridient = function (node) {          
            $scope.ingridientData.splice(node.ingridient.index,1);
            $scope.ingridientData.forEach(function(item, i, arr) {
                item.index = i;
            });
        };
        
    //update view
        
        $scope.treeIngridientsUpdate = {
            dropped : function (e) {
                $scope.recipe.ingridients.forEach(function(item, i, arr) {
                    item.index = i;
                });
            }
        };
        
        $scope.newExistingIngridient = function () {
            $scope.recipe.ingridients.push({
                'index': $scope.recipe.ingridients.length,
                caption: 'ingridient ' + ($scope.recipe.ingridients.length + 1),
                amount: 1,
                isPopover: false
            });
        };
        
        $scope.removeExistingIngridient = function (node) {          
            $scope.recipe.ingridients.splice(node.ingridient.index,1);
            $scope.recipe.ingridients.forEach(function(item, i, arr) {
                item.index = i;
            });
        };
    
    //UI func
        
        $scope.globalPopoverEnable = false;
        
        $scope.amountMinus = function(item) {
            item.amount--;
            if(item.amount<1){
                item.amount=1;
            }
            item.isPopover=false;
        };
        
        $scope.amountPlus = function(item) {
            item.amount++;
            item.isPopover=false;
        };
        
        $scope.applyAmount = function(item) {
            if(item.amount<1){
                item.amount=1;
            }
            item.isPopover=false;
        };
        
//Steps
        
    $scope.stepData = [];
        
    //create view
        
        $scope.treeStepsCreate = {
            dropped : function (e) {
                $scope.stepData.forEach(function(item, i, arr) {
                    item.index = i;
                });
            }
        };
        
        $scope.newStep = function () {
            $scope.stepData.push({
                'index': $scope.stepData.length,
                action: 'action ' + ($scope.stepData.length + 1),
                device: 'device',
                duration: 'duration'
            });
        };
        
        $scope.removeStep = function (node) {          
            $scope.stepData.splice(node.step.index,1);
            $scope.stepData.forEach(function(item, i, arr) {
                item.index = i;
            });
        };
        
    //update view
        
        $scope.treeStepsUpdate = {
            dropped : function (e) {
                $scope.recipe.steps.forEach(function(item, i, arr) {
                    item.index = i;
                });
            }
        };
        
        $scope.newExistingStep = function () {
            $scope.recipe.steps.push({
                'index': $scope.recipe.steps.length,
                action: 'action ' + ($scope.recipe.steps.length + 1),
                device: 'device',
                duration: 'duration'
            });
        };
        
        $scope.removeExistingStep = function (node) {          
            $scope.recipe.steps.splice(node.step.index,1);
            $scope.recipe.steps.forEach(function(item, i, arr) {
                item.index = i;
            });
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
                steps: this.stepData,
                ingridients: this.ingridientData
            });

            // Redirect after save
            recipe.$save(function(response) {
                $location.path('recipes/' + response.id);

            // Clear form fields
                $scope.title = '';
                $scope.content = '';
                $scope.stepData = [];
                $scope.ingridientData = [];
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