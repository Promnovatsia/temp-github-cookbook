'use strict';

// Recipes controller
angular.module('recipes').controller('RecipesController', 
                                     ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes','Ingridients', 'Measures',
    function($scope, $stateParams, $location, Authentication, Recipes, Ingridients, Measures) {
        
        $scope.authentication = Authentication;      

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
        
        /*.$promise.then(function(recipe) {
                if(recipe.ingridients.length>0){
                    recipe.ingridients.forEach(function(item, i, arr) {
                        Measures.get(
                            {measureId: i.ingridientAmount.measureId}
                        ).$promise.then(function(measure) {
                            item.measure = measure;
                        });
                    });   
                }
                console.log(recipe);
                return recipe;
            });*/
        
        //Igridients
      
        $scope.searchIngridient = false;
        $scope.ingridientData = [];
        $scope.measuresList = [];
        $scope.getIngridientList = function() {
            return Ingridients.query().$promise;
        };
        
        $scope.getMeasures = function() {
            return Measures.query().$promise;
        };
        
        $scope.getMeasuresList = function() {
           $scope.getMeasures().then(function(measuresList){
               $scope.measuresList=measuresList;
               return measuresList;
           }); 
        };

    //create view
        
        $scope.treeIngridients = {
            dropped : function (e) {
                if($scope.recipe){
                    $scope.recipe.ingridients.forEach(function(item, i, arr) {
                        item.index = i;
                    });
                } else {
                    $scope.ingridientData.forEach(function(item, i, arr) {
                        item.index = i;
                    }); 
                }
            }
        };     
        
        $scope.newIngridient = function (index) {
            $scope.selectedIngridient = '';
            Ingridients.get(
                {ingridientId: index}
            ).$promise.then(function(newIngridient){
                console.log(newIngridient);
                if($scope.recipe){
                    console.log('existing one');
                    Measures.get(
                        {measureId: newIngridient.ingridientAmount.measureId}
                    ).$promise.then(function(measure) {
                        $scope.recipe.ingridients.push({
                            'index': $scope.recipe.ingridients.length,
                            caption: newIngridient.caption,
                            amount: newIngridient.ingridientAmount.amount,
                            measure: measure,
                            isPopover: false
                        });
                    });
                } else {
                    console.log('new one');
                    console.log(newIngridient.measureDefault);
                    Measures.get(
                        {measureId: newIngridient.measureDefault}
                    ).$promise.then(function(measure) {
                        console.log(measure);
                        $scope.ingridientData.push({
                            'index': $scope.ingridientData.length,
                            caption: newIngridient.caption,
                            infoCard: newIngridient.infoCard,
                            amount: measure.min,
                            measure: measure,
                            isPopover: false
                        });
                    });
                }
            });
        };
        
        $scope.removeIngridient = function (node) {
            if($scope.recipe){
                $scope.recipe.ingridients.splice(node.ingridient.index,1);
                $scope.recipe.ingridients.forEach(function(item, i, arr) {
                    item.index = i;
                });
            } else {
                $scope.ingridientData.splice(node.ingridient.index,1);
                $scope.ingridientData.forEach(function(item, i, arr) {
                    item.index = i;
                });
            } 
        };
        
    //UI func
        
        $scope.globalPopoverEnable = false;
        
        $scope.amountMinus = function(item) {
            item.amount=Number((item.amount-item.measure.step).toFixed(2));
            if(item.amount<item.measure.min){
                item.amount=item.measure.min;
            }
            item.isPopover=false;
        };
        
        $scope.amountPlus = function(item) {
            item.amount=Number((item.amount+item.measure.step).toFixed(2));
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

    
    }
    
]);