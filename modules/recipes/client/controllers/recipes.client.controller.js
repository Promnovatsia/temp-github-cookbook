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
                $scope.recipe = recipe;
            });
        };
        
    //Igridients
      
        $scope.ingridientData = [];
        $scope.measuresList = [];
        $scope.getIngridientList = function() {
            return Ingridients.query().$promise;
        };
        
        $scope.getMeasuresList = function() {
            return Measures.query().$promise;
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
            if(!id || id % 1 !== 0) {
                $scope.selectedIngridient='';
                return;
            }
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
                                isPopover: false,
                                isConvert:false
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
                                isPopover: false,
                                isConvert:false
                            }
                        );    
                    }
                });
                $scope.selectedIngridient='';
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
        
        $scope.amountApply = function(item) {
            if(item.selectedMeasure!==''){
                Measures.get(
                        {
                            measureId: item.selectedMeasure
                        }
                ).$promise.then(function(measure) {
                    item.measure=measure;
                    item.amount=$scope.measuresList.find(x=> x.id === item.selectedMeasure).value;
                });    
            }
            item.amount=Number((item.amount - item.amount % item.measure.step).toFixed(2));
            if(item.amount<item.measure.min){
                item.amount=item.measure.min;
            }
            item.isPopover=false;
            item.isConvert=false;
        };
        
        $scope.converter = function(item) {
            item.isPopover=false;
            console.log(item.measure.converter);
            $scope.measuresList=[];
            item.selectedMeasure='';
            item.measure.converter.forEach(function(measure, i, arr) {
                var value=0;
                if(measure.rate===0){
                    value=1;
                }
                else {
                    value=Number((item.amount * measure.rate).toFixed(2));
                }
                if(item.amount<item.measure.min){
                    item.amount=item.measure.min;
                }
                    $scope.measuresList.push(
                        {
                            id: measure.id,
                            value: value,
                            caption: value + ' ' + measure.caption,
                        }
                    );
            });
            item.isConvert=true;
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
                        action: $scope.actionStep,
                        device: 'device',
                        duration: 'duration'
                    }
                );    
            } else {
                $scope.stepData.push(
                    {
                        'index': $scope.stepData.length,
                        action: $scope.actionStep,
                        device: 'device',
                        duration: 'duration'
                    }
                );   
            }
            $scope.actionStep='';
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

    }    
]);