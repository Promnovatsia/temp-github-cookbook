'use strict';

angular
    .module('recipes')
    .controller('ShelfController', ShelfController);

ShelfController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'ShelfService', 'ShelfQueryService', 'IngredientService', 'MeasureService'];

function ShelfController($scope, $stateParams, $location, $window, Authentication, ShelfService, ShelfQueryService, IngredientService, MeasureService) {

    // progress bar settings
    const pbLimitDeficit = 20;
    const pbLimitDesired = 50;
    const pbLimitMax = 80;
        
    $scope.authentication = Authentication;
    $scope.error = null;
    
    $scope.ingredientList = [];
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
                if (shelf.ingredientId) {
                    $scope.loadIngredient(shelf.ingredientId).then(function (ingredient) {
                        $scope.setIngredient(ingredient);    
                    });      
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
    
    $scope.loadIngredient = function (id) {
        return IngredientService.get(
            {
                ingredientId: id
            }
        ).$promise;
    };
    
    $scope.setIngredient = function (ingredient) {
        
        if (!ingredient) {
            $scope.shelf.ingridientId = null;
            $scope.ingredient = null;
            return;
        }
        
        $scope.ingredient = ingredient;
        $scope.shelf.ingredientId = ingredient.id;
        ingredient.getMeasure().then(function (measure) {
            $scope.measure = measure;
        });
        
        $scope.asyncSelected = '';
    };
    
    $scope.filterBar = {
        spoiled: true,
        deficit: true,
        lsdesired: true,
        desired: true,
        max: true
    };
    
    $scope.filterBarToggle = function () {
        
        if ($scope.filterBar.deficit && $scope.filterBar.lsdesired && $scope.filterBar.desired && $scope.filterBar.max) {
            $scope.filterBar = {
                deficit: false,
                lsdesired: false,
                desired: false,
                max: false
            };       
        } else {
            $scope.filterBar = {
                deficit: true,
                lsdesired: true,
                desired: true,
                max: true
            };
        }
    };
    
    $scope.filterByProgress = function (index) {
        var item = $scope.shelves[index];
        if (!item.progressbar) return true;
        return ($scope.filterBar.spoiled && item.isSpoiled) ||
            ($scope.filterBar.deficit && item.progressbar.value <= pbLimitDeficit) ||
            ($scope.filterBar.lsdesired && item.progressbar.value > pbLimitDeficit && item.progressbar.value < pbLimitDesired) ||
            ($scope.filterBar.desired && item.progressbar.value >= pbLimitDesired && item.progressbar.value <= pbLimitMax) ||
            ($scope.filterBar.max && item.progressbar.value > pbLimitMax && item.progressbar.value <= 100);
    };
    
    $scope.clearSpoiled = function () {
        //TODO clearSpoiled        
    };
    
    $scope.validateDeficit = function (id, value, oldValue) {
        $scope.form = {
            deficit: false,
            desired: false,
            max: false
        };
        if (value < $scope.measure.min || $scope.shelf.desired <= value) {
            $scope.form.deficit = true;
            return false;
        }
        return true;
    };
    
    $scope.validateDesired = function (id, value, oldValue) {
        $scope.form = {
            deficit: false,
            desired: false,
            max: false
        };
        if (value <= $scope.shelf.deficit || $scope.shelf.max <= value) {
            $scope.form.desired = true;
            return false;
        }
        return true;
    };
    
    $scope.validateMax = function (id, value, oldValue) {
        $scope.form = {
            deficit: false,
            desired: false,
            max: false
        };
        if (value <= $scope.shelf.desired) {
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
        
        $scope.shelf.caption = $scope.ingredient.caption;
        $scope.shelf.measureCaption = $scope.measure.caption;
        $scope.shelf.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);

        function successCallback(res) {
            $location.path('shelf/' + $scope.shelf.number);
        }

        function errorCallback(res) {
            $scope.error = res.data.message;
        }
    };
}
