'use strict';

// Recipes controller
angular.module('recipes').controller('RecipesController', 
                                     ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes','Ingridients', 'Measures',
    function($scope, $stateParams, $location, Authentication, Recipes, Ingridients, Measures) {
        
        $scope.authentication = Authentication;      

        $scope.sort = function(a, b) {
            return a.index - b.index;
        };
        
    // Find a list of Recipes
        $scope.find = function() {
            $scope.recipes = Recipes.query();
        };
        
    // Find existing Recipe
        $scope.findOne = function() {
            Recipes.get(
                {
                    recipeId: $stateParams.recipeId
                }
            ).$promise.then(function(recipe) {
                if (recipe.ingridients.length>0) {
                    recipe.ingridients.forEach(function(item, i, arr) {
                        Measures.get(
                            {
                                measureId: item.ingridientAmount.measureId
                            }
                        ).$promise.then(function(measure) {
                            item.measure = measure;
                            item.index = item.ingridientAmount.index;
                            item.amount = item.ingridientAmount.amount;
                            item.measureCaption = measure.caption;
                        });
                    });   
                }
                recipe.ingridients.sort($scope.sort);
                console.log(recipe.ingridients);
                $scope.recipe = recipe;
            });
        };
        
    //Igridients
      
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
        
        $scope.newIngridient = function (id) {
            $scope.selectedIngridient='';
            Ingridients.get(
                {
                    ingridientId: id
                }
            ).$promise.then(function(newIngridient){
                Measures.get(
                        {
                            measureId: newIngridient.measureDefault
                        }
                ).$promise.then(function(measure) {
                    if($scope.recipe){
                        $scope.recipe.ingridients.push(
                            {
                                id: newIngridient.id,
                                'index': $scope.recipe.ingridients.length,
                                caption: newIngridient.caption,
                                infoCard: newIngridient.infoCard,
                                image: newIngridient.image,
                                amount: measure.min,
                                measure: measure,
                                measureCaption: measure.caption,
                                isPopover: false
                            }
                        );
                    } else {
                        $scope.ingridientData.push(
                            {
                                id: newIngridient.id,
                                'index': $scope.ingridientData.length,
                                caption: newIngridient.caption,
                                infoCard: newIngridient.infoCard,
                                image: newIngridient.image,
                                amount: measure.min,
                                measure: measure,
                                measureCaption: measure.caption,
                                isPopover: false
                            }
                        );    
                    }
                });
            }).catch(function(err) {
                
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
            if(item.amount<item.measure.min){
                item.amount=item.measure.min;
            }
            item.isPopover=false;
        };
        
    //Steps
        
        $scope.stepData = [];

        $scope.treeSteps = {
            dropped : function (e) {
                if ($scope.recipe) {
                    $scope.recipe.steps.forEach(function(item, i, arr) {
                        item.index = i;
                    });   
                } else {
                    $scope.stepData.forEach(function(item, i, arr) {
                        item.index = i;
                    });
                }  
            }
        };

        $scope.newStep = function () {
            if ($scope.recipe) {
                $scope.recipe.steps.push(
                    {
                        'index': $scope.recipe.steps.length,
                        action: 'action ' + ($scope.recipe.steps.length + 1),
                        device: 'device',
                        duration: 'duration'
                    }
                );    
            } else {
                $scope.stepData.push(
                    {
                        'index': $scope.stepData.length,
                        action: 'action ' + ($scope.stepData.length + 1),
                        device: 'device',
                        duration: 'duration'
                    }
                );   
            }
        };

        $scope.removeStep = function (node) {
            if ($scope.recipe) {
                $scope.recipe.steps.splice(node.step.index,1);
                $scope.recipe.steps.forEach(function(item, i, arr) {
                    item.index = i;
                });
            } else {
                $scope.stepData.splice(node.step.index,1);
                $scope.stepData.forEach(function(item, i, arr) {
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

            var recipe = new Recipes(
                {
                    title: this.title,
                    content: this.content,
                    steps: this.stepData,
                    ingridients: $scope.ingridientData
                }
            );
            console.log($scope.ingridientData);
            console.log(recipe);

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
            console.log($scope.recipe.ingridients);
            recipe.$update(function() {
                $location.path('recipes/' + recipe.id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    
    }    
]);