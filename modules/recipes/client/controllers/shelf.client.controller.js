'use strict';

angular
    .module('recipes')
    .controller('ShelfController', ShelfController);

ShelfController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'ShelfService'];

function ShelfController($scope, $stateParams, $location, $window, Authentication, ShelfService) {

    $scope.authentication = Authentication;
    $scope.error = null;
    
    $scope.find = function () {
        ShelfService.query().$promise.then(function (shelves) {
            shelves.forEach(function (shelf, i, arr) {
                $scope.progressUpdate(shelf);    
            });
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
            });    
        } else {
            $scope.shelf = new ShelfService(
                {
                    stored: 15,
                    desired: 25,
                    max: 30,
                    deficit: 10
                    //FIX ME replace this with actual feature
                }
            );
            $scope.spoilUpdate($scope.shelf.isSpoiled);
        }
        
    };
    
    $scope.progressUpdate = function (shelf) {
        
        // const values in percent of bar
        const pbLimitEmpty = 10;
        const pbLimitDeficit = 20;
        const pbLengthDeficit = 20;
        const pbLimitDesired = 50;
        const pbLengthDesired = 30;
        const pbLimitMax = 80;
        const pbLenghtMax = 30;
        const pbMultyMax = 5;
        
        if(shelf.isSpoiled) {
            shelf.progressbar = {
                type: 'danger',
                text: "!!spoiled!!",
                class: "progress-striped active"
            };
            return;
        }
        
        if (shelf.stored <= 0) { // 0%
            shelf.progressbar = {
                type: 'default',
                text: "empty",
                value: pbLimitEmpty
            };    
        } else if (shelf.stored <= shelf.deficit) {
            shelf.progressbar = 
                {
                    type: 'danger',
                    text: "! " + shelf.stored + " < " + shelf.deficit + " !", 
                    value: pbLimitDeficit - pbLengthDeficit + 
                        ((shelf.stored / shelf.deficit) * pbLengthDeficit)
                };
            if (shelf.progressbar.value < pbLimitEmpty) {
                shelf.progressbar.value = pbLimitEmpty;
                shelf.progressbar.class = "progress-striped active";
            }    
        } else if (shelf.stored < shelf.desired) {
            shelf.progressbar = 
                {
                    type: 'warning',
                    text: shelf.stored,
                    value: pbLimitDesired - pbLengthDesired + 
                        ((shelf.stored - shelf.deficit) / (shelf.desired - shelf.deficit) * pbLengthDesired)
                };   
        } else if (shelf.stored <= shelf.max) {
            shelf.progressbar = 
                {
                    type: 'success',
                    text: shelf.stored,
                    value: pbLimitMax - pbLenghtMax + 
                        ((shelf.stored - shelf.desired) / (shelf.max - shelf.desired) * pbLenghtMax)
                };  
        } else {
            shelf.progressbar = 
                {
                    type: 'info',
                    text: shelf.stored + " > " + shelf.max,
                    value: pbLimitMax - pbMultyMax + 
                        (shelf.stored / shelf.max) * pbMultyMax
                };
            if (shelf.progressbar.value > 100) { // 100%
                shelf.progressbar.value = 100; // set to 100%
                shelf.progressbar.class = "progress-striped active";
            }       
        }
               
    };
    
    $scope.spoilUpdate = function (state) {
        
        const btnInactive = "btn btn-default";
        const btnGood = "btn btn-success";
        const btnBad = "btn btn-danger";
        
        if (state) {
            $scope.shelf.isSpoiled = true;
            $scope.btnIsSpoiledTrue = btnInactive;
            $scope.btnIsSpoiledFalse = btnBad;
        } else {
            $scope.shelf.isSpoiled = false;
            $scope.btnIsSpoiledTrue = btnGood;
            $scope.btnIsSpoiledFalse = btnInactive;
        }
        $scope.progressUpdate($scope.shelf); 
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
        console.log("save");
        $scope.shelf.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);


        function successCallback(res) {
            console.log("success");
            $location.path('shelf/' + $scope.shelf.id);
        }

        function errorCallback(res) {
            $scope.error = res.data.message;
        }
    };
}