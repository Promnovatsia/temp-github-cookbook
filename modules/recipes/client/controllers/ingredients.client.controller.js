'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('IngredientsController', IngredientsController);
IngredientsController.$inject = ['$scope', '$stateParams', '$location', '$window', '$timeout', 'Authentication', 'IngredientService', 'MeasureService', 'FileUploader'];
function IngredientsController($scope, $stateParams, $location, $window, $timeout, Authentication, IngredientService, MeasureService, FileUploader) {

    $scope.authentication = Authentication;

    $scope.find = function () {
        IngredientService.query().$promise.then(function (ingredients) {
            $scope.ingredients = ingredients;
        });
    };

    $scope.findOne = function () {
        if ($stateParams.ingredientId) {
            IngredientService.get(
                {
                    ingredientId: $stateParams.ingredientId
                }
            ).$promise.then(function (ingredient) {
                $scope.ingredient = ingredient;
                ingredient.getMeasure().then(function (measure) {
                    $scope.ingredient.measure = measure;
                });
                ingredient.getShelf().then(function (shelf) {
                    if (shelf.id) {
                        $scope.shelf = shelf;
                    }
                });
            });    
        } else {
            $scope.ingredient = new IngredientService();
        }
    };
    
    $scope.getMeasures = function (value) {
        return MeasureService.query().$promise.then(function (results) {
            var matched = [];
            results.forEach(function (item, i, arr) {
                if (item.caption.includes(value)) {
                    matched.push(item);
                }
            });
            return matched;
        });
    };
    
    $scope.setMeasure = function (subMeasure) {
        $scope.ingredient.measureDefault = subMeasure.id;
        $scope.ingredient.measure = subMeasure;
    };
    
    $scope.unsetMeasure = function () {
        $scope.ingredient.measure = null;
        $scope.ingredient.measureDefault = null;
        $scope.asyncSelected = null;
    };
    
    $scope.unsetPicture = function () {
        $scope.ingredient.image = "";
        $scope.uploader.clearQueue();
    };
    
    $scope.save = function (isValid) {
        
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'menuForm');
            return false;
        }
        
        $scope.ingredient.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);

        function successCallback(res) {
            $location.path('ingredients/' + $scope.ingredient.id);
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