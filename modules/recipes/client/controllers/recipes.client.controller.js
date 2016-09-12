'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('RecipesController', RecipesController);
RecipesController.$inject = ['$scope', '$stateParams', '$location', '$window', '$timeout', 'Authentication', 'RecipeService', 'IngredientService', 'FileUploader'];

function RecipesController($scope, $stateParams, $location, $window, $timeout, Authentication, RecipeService, IngredientService, FileUploader) {

    $scope.authentication = Authentication;
    $scope.ingredientList = [];

   /* $scope.quantity = 5;
    $scope.imageurl = 'http://res.cloudinary.com/thomascookbook/image/upload/v1466671927/';
    $scope.portionsEdit = false;
    $scope.portions = 2;

    $scope.sort = function (a, b) {
        return a.index - b.index;
    };

    $scope.find = function () {
        $scope.recipes = Recipes.query();
    };

// Find existing Recipe
    $scope.findOne = function () {
        Recipes.get(
            {
                recipeId: $stateParams.recipeId
            }
        ).$promise.then(function (recipe) {
            if (recipe.ingridients.length > 0) {
                recipe.ingridients.forEach(function (item, i, arr) {
                    Measures.get(
                        {
                            measureId: item.measureDefault
                        }
                    ).$promise.then(function (measure) {
                        item.measure = measure;
                        item.index = item.ingridientAmount.index;
                        item.amount = item.ingridientAmount.amount;
                        item.measureCaption = measure.caption;
                    });
                });
            }
            recipe.ingridients.sort($scope.sort);
            $scope.recipe = recipe;
            $scope.ingridientData = $scope.recipe.ingridients;
            //NOTE add title etc. to scope end change edit.view
        });
    };

//Igridients

    $scope.ingridientData = [];
    $scope.measuresList = [];

    $scope.getIngridientList = function () {
        return Ingridients.query().$promise;
    };

    $scope.getMeasuresList = function () {
        return Measures.query().$promise;
    };

//create view

    $scope.treeIngridients = {
        //FIX ME возможность перетащить шаг в ингридиенты и наоборот 
        dropped : function (e) {
            $scope.ingridientData.forEach(function (item, i, arr) {
                item.index = i;
            });
        }
    };

    $scope.newIngridient = function (id) {
        if (!id || id % 1 !== 0) {
            $scope.selectedIngridient = '';
            //TODO не сбрасывать выбор, а открыть интерфейс вноса незанесенного ингридиента
            return;
        }
        Ingridients.get(
            {
                ingridientId: id
            }
        ).$promise.then(function (newIngridient) {
            Measures.get(
                {
                    measureId: newIngridient.measureDefault
                }
            ).$promise.then(function (measure) {
                $scope.ingridientData.push(
                    {
                        id: newIngridient.id,
                        index: $scope.ingridientData.length,
                        caption: newIngridient.caption,
                        infoCard: newIngridient.infoCard,
                        image: newIngridient.image,
                        amount: measure.min,
                        measure: measure,
                        measureCaption: measure.caption,
                        isPopover: false,
                        isConvert: false,
                        selectedMeasure: ''
                    }
                );
            });
            $scope.selectedIngridient = '';
        }).catch(function (err) {});
    };

    $scope.removeIngridient = function (node) {
        $scope.ingridientData.splice(node.ingridient.index, 1);
        $scope.ingridientData.forEach(function (item, i, arr) {
            item.index = i;
        });
    };

//UI func

    $scope.globalPopoverEnable = false;

    $scope.amountMinus = function (item) {
        item.amount = Number((item.amount - item.measure.step).toFixed(2));
        if (item.amount < item.measure.min) {
            item.amount = item.measure.min;
        }
        item.isPopover = false;
    };

    $scope.amountPlus = function (item) {
        item.amount = Number((item.amount + item.measure.step).toFixed(2));
        item.isPopover = false;
    };

    $scope.amountApply = function (item) {
        if (item.selectedMeasure !== '' && item.isConvert === true) {
            var targetMeasure = '';
            $scope.measuresList.forEach(function (elem, i, arr) {
                if (elem.caption === item.selectedMeasure) {
                    targetMeasure = elem;
                }
            });
            if (targetMeasure === '') {
                item.selectedMeasure = '';
                return;
            }
            Measures.get(
                {
                    measureId: targetMeasure.id
                }
            ).$promise.then(function (measure) {
                item.measure = measure;
                item.amount = targetMeasure.value;
            });
        }
        if (item.amount % item.measure.step > 0) {
            item.amount = Number((item.amount - item.amount % item.measure.step + item.measure.step).toFixed(2));
        }
        if (item.amount < item.measure.min) {
            item.amount = item.measure.min;
        }
        item.isPopover = false;
        item.isConvert = false;
        item.selectedMeasure = '';
    };

    $scope.converter = function (item) {
        item.isPopover = false;
        $scope.measuresList = [];
        item.selectedMeasure = '';
        item.measure.converter.forEach(function (measure, i, arr) {
            var value = 0;
            if (measure.rate === 0) {
                value = 1;
            } else {
                value = Number((item.amount * measure.rate).toFixed(2));
            }
            if (item.amount < item.measure.min) {
                item.amount = item.measure.min;
            }
            $scope.measuresList.push(
                {
                    id: measure.id,
                    value: value,
                    caption: value + ' ' + measure.caption
                }
            );
        });
        item.isConvert = true;
    };

//Steps

    $scope.stepData = [];

    $scope.treeSteps = {
        dropped: function (e) {
            $scope.stepData.forEach(function (item, i, arr) {
                item.index = i;
            });
        }
    };

    $scope.newStep = function () {
        $scope.stepData.push(
            {
                index: $scope.stepData.length,
                action: $scope.actionStep,
                device: 'device',
                duration: 'duration'
                //CHANGES image: ''
            }
        );
        $scope.actionStep = '';
    };

    $scope.removeStep = function (node) {
        $scope.stepData.splice(node.step.index, 1);
        $scope.stepData.forEach(function (item, i, arr) {
            item.index = i;
        });
    };

// Create new Recipe
    $scope.create = function (isValid) {
        $scope.error = null;

        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'recipeForm');
            return false;
        }

        // Create new Recipe object

        var recipe = new Recipes(
            {
                title: this.title,
                infoCard: this.infoCard,
                //CHANGES image: this.image,
                protions: this.portions,
                //FIXME typo 'protions' -> 'portions'
                content: this.content,
                steps: this.stepData,
                ingridients: $scope.ingridientData
            }
        );

        // Redirect after save
        recipe.$save(function (response) {
            $location.path('recipes/' + response.id);

        // Clear form fields
            $scope.title = '';
            $scope.content = '';
            $scope.stepData = [];
            $scope.ingridientData = [];
        }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
        });
    };

// Update existing Recipe
    $scope.update = function (isValid) {
        $scope.error = null;

        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'recipeForm');
            return false;
        }

        var recipe = $scope.recipe;
        recipe.ingridients = $scope.ingridientData;
        recipe.steps = $scope.stepData;
        recipe.$update(function () {
            $location.path('recipes/' + recipe.id);
        }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
        });
    };

    // Remove existing Recipe
    $scope.remove = function (recipe) {
        if (recipe) {
            recipe.$remove();
            $location.path('recipes');
        } else {
            $scope.recipe.$remove(function () {
                $location.path('recipes');
            });
        }
    };*/

    $scope.find = function () {
        RecipeService.query().$promise.then(function (recipes) {
            $scope.recipes = recipes;
        });
    };

    $scope.findOne = function () {
        if ($stateParams.recipeId) {
            RecipeService.get(
                {
                    recipeId: $stateParams.recipeId
                }
            ).$promise.then(function (recipe) {
                $scope.recipe = recipe;
            });    
        } else {
            $scope.recipe = new RecipeService({
                portions: 2,
                ingredients: [],
                steps: []
            });
        }
    };
    
    $scope.getIngredients = function (value) {
        var matched = [];
        if ($scope.ingredientList.length === 0) {
            IngredientService.query().$promise.then(function (results) {
                $scope.ingredientList = results;
                results.forEach(function (item, i, arr) {
                    if (item.caption.includes(value)) {
                        matched.push(item);
                    }
                });
            });   
        } else {
            $scope.ingredientList.forEach(function (item, i, arr) {
                if (item.caption.includes(value)) {
                    matched.push(item);
                }
            });    
        }
        return matched;
    };
    
    $scope.addIngredient = function (ingredient) {
        if (!ingredient.measure) {
            ingredient.getMeasure().then(function (measure) {
                ingredient.measure = measure;
                if (!ingredient.amount) {
                    ingredient.amount = ingredient.measure.min;
                }
            });
        }
        $scope.recipe.ingredients.push(ingredient);
        $scope.asyncSelectedAdd = "";
    };
    
    $scope.removeIngredient = function (index) {
        $scope.recipe.ingredients.splice(index, 1);
    };
    
    $scope.addStep = function () {
        $scope.recipe.steps.push({
            action: ""
        });
    };
    
    $scope.removeStep = function (index) {
        $scope.recipe.steps.splice(index, 1);
    };
    
    $scope.selectMain = function (ingredient) {
        $scope.recipe.mainIngredient = ingredient;
        $scope.asyncSelectedMain = "";
    };
    
    $scope.unsetPicture = function () {
        $scope.ingredient.image = "";
        $scope.uploader.clearQueue();
    };
    
    $scope.save = function (isValid) {
        
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'recipeForm');
            return false;
        }
        
        $scope.recipe.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);

        function successCallback(res) {
            $location.path('recipes/' + $scope.recipe.id);
        }

        function errorCallback(res) {
            $scope.error = res.data.message;
        }
    };

    var uploader = $scope.uploader = new FileUploader({
        url: '/api/pictures/recipes'
    });

    $scope.imageurl = 'http://res.cloudinary.com/thomascookbook/image/upload/v1466671927/';

    // FILTERS

    uploader.filters.push(
        {
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        },
        {
            name: 'overWriteFilter',
            fn: function(item, options) {
                if(this.queue.length===1){
                    this.clearQueue();
                }
                return true;
            }
        }
    );

        // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
        if ($window.FileReader) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(fileItem._file);

            fileReader.onload = function (fileReaderEvent) {
                $timeout(function () {
                    $scope.imageURL = fileReaderEvent.target.result;
                }, 0);
            };
        }
    };
}