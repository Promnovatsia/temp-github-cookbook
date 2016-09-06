'use strict';

angular
    .module('recipes')
    .controller('ShelfController', ShelfController);

ShelfController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'ShelfService', 'ShelfQueryService', 'IngredientService', 'MeasureService'];

function ShelfController($scope, $stateParams, $location, $window, Authentication, ShelfService, ShelfQueryService, IngredientService, MeasureService) {

    // progress bar settings
    const pbLimitEmpty = 10;
    const pbLimitDeficit = 20;
    const pbLengthDeficit = 20;
    const pbLimitDesired = 50;
    const pbLengthDesired = 30;
    const pbLimitMax = 80;
    const pbLenghtMax = 30;
    const pbMultyMax = 5;
    
    // spoil button style settings
    const btnInactive = "btn btn-default";
    const btnGood = "btn btn-success";
    const btnBad = "btn btn-danger";
        
    $scope.authentication = Authentication;
    $scope.error = null;
    
    $scope.handle = true;
    $scope.legend = false;
    $scope.selectedIngridient = "";
    $scope.imageurl = 'http://res.cloudinary.com/thomascookbook/image/upload/v1466671927/';
    
    $scope.find = function () {
        ShelfService.query().$promise.then(function (shelves) {
            $scope.shelves = shelves;
        });
    };
    
    $scope.findOne = function () {
        if ($stateParams.shelfId) {
            ShelfService.get(
                {
                    shelfId: $stateParams.shelfId
                }
            ).$promise.then(function (shelf) {
                $scope.shelf = shelf;
                $scope.spoilUpdate(shelf.isSpoiled);
                if (shelf.ingridientId) {
                    $scope.setIngredient(shelf.ingridientId);        
                }
            });    
        } else {
            $scope.shelf = new ShelfService(
                {
                    stored: 15,
                    desired: 25,
                    max: 30,
                    deficit: 10
                }
            );
            if ($stateParams.ingredient) {
                $scope.setIngredient($stateParams.ingredient);
            }
            $scope.spoilUpdate($scope.shelf.isSpoiled);
        } 
    };
    
    $scope.getIngredients = function (value) {
        return IngredientService.query().$promise.then(function (results) {
            var matched = [];
            results.forEach(function (item, i, arr) {
                if (item.caption.includes(value)) {
                    matched.push(item);
                }
            });
            return matched;
        });
    };
    
    $scope.setIngredient = function (ingredient) {
        
        if (!ingredient) {
            $scope.shelf.ingridientId = null;
            $scope.ingredient = ingredient;
            return;
        }
        if(!ingredient.id) {
            IngredientService.get(
                {
                    ingredientId: ingredient
                }
            ).$promise.then(function (theIngredient) {
                $scope.ingredient = theIngredient;
                $scope.shelf.ingridientId = theIngredient.id;
                theIngredient.getMeasure().then(function (measure) {
                    $scope.measure = measure;
                });
            });    
        } else {
            $scope.ingredient = ingredient;
            $scope.shelf.ingridientId = ingredient.id;
            $scope.measure = ingredient.measure;
        }
    };
    
    
    /*$scope.findForShelf = function () {
        ShelfQueryService.query(
            {
                shelfId: $stateParams.shelfId
            }
        ).$promise.then(function (shelfQueries) {
            $scope.shelfQueries = shelfQueries;
            ShelfService.get(
                {
                    shelfId: $stateParams.shelfId
                }
            ).$promise.then(function (shelf) {
                $scope.shelf = shelf;
            });
        });
    };*/
    
    $scope.filterBar = {
        spoiled: true,
        empty: true,
        deficit: true,
        lsdesired: true,
        desired: true,
        max: true
    };
    
    $scope.filterBarToggle = function () {
        
        if ($scope.filterBar.spoiled && $scope.filterBar.empty && $scope.filterBar.deficit && $scope.filterBar.lsdesired && $scope.filterBar.desired && $scope.filterBar.max) {
            $scope.filterBar.spoiled = false;
            $scope.filterBar.empty = false;
            $scope.filterBar.deficit = false;
            $scope.filterBar.lsdesired = false;
            $scope.filterBar.desired = false;
            $scope.filterBar.max = false;        
        } else {
            $scope.filterBar.spoiled = true;
            $scope.filterBar.empty = true;
            $scope.filterBar.deficit = true;
            $scope.filterBar.lsdesired = true;
            $scope.filterBar.desired = true;
            $scope.filterBar.max = true;
        }
    };
    
    $scope.filterByProgress = function (item){
        if (!item.progressbar) return true;
        return false ||
            ($scope.filterBar.spoiled && item.isSpoiled) ||
            ($scope.filterBar.empty && !item.isSpoiled && item.progressbar.value <= pbLimitEmpty) ||
            ($scope.filterBar.deficit && item.progressbar.value > pbLimitEmpty && item.progressbar.value <= pbLimitDeficit) ||
            ($scope.filterBar.lsdesired && item.progressbar.value > pbLimitDeficit && item.progressbar.value <= pbLimitDesired) ||
            ($scope.filterBar.desired && item.progressbar.value > pbLimitDesired && item.progressbar.value <= pbLimitMax) ||
            ($scope.filterBar.max && item.progressbar.value > pbLimitMax && item.progressbar.value <= 100);
    };
    
    $scope.spoilUpdate = function (state) {
        
        if (state) {
            $scope.shelf.isSpoiled = true;
            $scope.btnIsSpoiledTrue = btnInactive;
            $scope.btnIsSpoiledFalse = btnBad;
        } else {
            $scope.shelf.isSpoiled = false;
            $scope.btnIsSpoiledTrue = btnGood;
            $scope.btnIsSpoiledFalse = btnInactive;
        }
    };
    
    $scope.clearSpoiled = function () {
    //TODO clearSpoiled        
    };
    
    $scope.settingsUpdate = function () {
        
        $scope.form = {
            deficit: false,
            desired: false,
            max: false
        };
        
        if ($scope.shelf.deficit < $scope.measure.min) {
            $scope.form.deficit = true;
            return false;
        }
        if ($scope.shelf.desired <= $scope.shelf.deficit) {
            $scope.form.desired = true;
            return false;
        }
        if ($scope.shelf.max <= $scope.shelf.desired) {
            $scope.form.max = true;
            return false;
        }
        return true;
    };
    
    $scope.remove = function () {
        if ($window.confirm('Are you sure you want to delete?')) {
            $scope.shelf.$remove();
            $location.path('shelf');    
        }
    };

    $scope.save = function (isValid) {
        
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'shelfForm');
            return false;
        }
        
        $scope.shelf.caption = $scope.info.caption;
        $scope.shelf.measureCaption = $scope.info.measure;
        $scope.shelf.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);

        function successCallback(res) {
            $location.path('shelf/' + $scope.shelf.id);
        }

        function errorCallback(res) {
            $scope.error = res.data.message;
        }
    };
}