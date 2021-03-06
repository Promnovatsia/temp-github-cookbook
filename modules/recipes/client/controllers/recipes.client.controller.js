'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('RecipesController', RecipesController);
RecipesController.$inject = ['$scope', '$stateParams', '$location', '$window', '$timeout', 'Authentication', 'RecipeService', 'IngredientService', 'FileUploader'];

function RecipesController($scope, $stateParams, $location, $window, $timeout, Authentication, RecipeService, IngredientService, FileUploader) {

    $scope.authentication = Authentication;
    $scope.ingredientList = [];
    $scope.shelves = false;

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
                if (recipe.ingredients.length > 0) {
                    var ingredients = recipe.ingredients;
                    recipe.ingredients = [];
                    ingredients.forEach(function (item, i, arr) {
                        $scope.getIngredients(item.caption).then(function (match) {
                            if (match.length > 0) {
                                var measureDefault = match[0].measureDefault;
                                match[0].measureDefault = item.ingredientAmount.measureId;
                                match[0].amount = item.ingredientAmount.amount;
                                match[0].comment = item.ingredientAmount.comment;
                                $scope.addIngredient(match[0]);
                                $scope.recipe.ingredients[i].measureDefault = measureDefault;
                            }
                        });
                    });
                }   
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
            return IngredientService.query().$promise.then(function (results) {
                $scope.ingredientList = results;
                results.forEach(function (item, i, arr) {
                    if (item.caption.includes(value)) {
                        matched.push(item);
                    }
                });
                return matched;
            });
        } else {
            $scope.ingredientList.forEach(function (item, i, arr) {
                if (item.caption.includes(value)) {
                    matched.push(item);
                }
            });
            return matched;
        }
    };
    
    $scope.addIngredient = function (ingredient) {
        var newIngredient = new IngredientService(ingredient);
        if (!ingredient.measure) {
            ingredient.getMeasure().then(function (measure) {
                newIngredient.measure = measure;
                if (!ingredient.amount) {
                    newIngredient.amount = newIngredient.measure.min;
                }
            });
        } else {
            newIngredient.measure = ingredient.measure;
            newIngredient.amount = ingredient.amount;
        }
        newIngredient.index = $scope.recipe.ingredients.length;
        newIngredient.getShelf().then(function (shelf) {
            if (shelf.id) {
                console.log(shelf);
                newIngredient.shelf = shelf;
            }
        });    
        $scope.recipe.ingredients.push(newIngredient);
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
        $scope.recipe.image = "";
        $scope.uploader.clearQueue();
    };
    
    $scope.save = function (isValid) {
        
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'recipeForm');
            return false;
        }
        
        $scope.recipe.ingredients.forEach(function (item, i, arr) {
            item.index = i; 
        });
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
        url: '/api/pictures/ingredients'
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