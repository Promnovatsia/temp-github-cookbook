'use strict';

angular
    .module('recipes')
    .controller('ShelfController', ShelfController);

ShelfController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'ShelfService', 'Ingridients', 'Measures'];

function ShelfController($scope, $stateParams, $location, $window, Authentication, ShelfService, Ingridients, Measures) {

    // const values in percent of bar
    const pbLimitEmpty = 10;
    const pbLimitDeficit = 20;
    const pbLengthDeficit = 20;
    const pbLimitDesired = 50;
    const pbLengthDesired = 30;
    const pbLimitMax = 80;
    const pbLenghtMax = 30;
    const pbMultyMax = 5;
    
    const btnInactive = "btn btn-default";
    const btnGood = "btn btn-success";
    const btnBad = "btn btn-danger";
        
    
    $scope.authentication = Authentication;
    $scope.error = null;
    $scope.info = {};
    $scope.selectedIngridient = "";
    $scope.filterIndex = "";
    $scope.imageurl = 'http://res.cloudinary.com/thomascookbook/image/upload/v1466671927/';
    
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
                if (shelf.ingridientId) {
                    $scope.setIngridient(shelf.ingridientId);        
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
            $scope.spoilUpdate($scope.shelf.isSpoiled);
        }
        
    };
    
    $scope.filterByProgress = function (){
        
        var lowerBound, upperBound;
        if ($scope.filterIndex === 'empty') {
            lowerBound = 0; //0%
            upperBound = pbLimitEmpty;    
        } else if ($scope.filterIndex === 'deficit') {
            lowerBound = pbLimitEmpty;
            upperBound = pbLimitDeficit;
        } else if ($scope.filterIndex === 'lsdesired') {
            lowerBound = pbLimitDeficit;
            upperBound = pbLimitDesired;
        } else if ($scope.filterIndex === 'desired') {
            lowerBound = pbLimitDesired;
            upperBound = pbLimitMax;
        } else if ($scope.filterIndex === 'max') {
            lowerBound = pbLimitMax;
            upperBound = 100; //100%
        } else { //drop filter
            lowerBound = 0;
            upperBound = 100;
        }
        return function (item){
            return (item.value >= lowerBound) && (item.value < upperBound);
        };
    };
    
    $scope.getIngridientList = function () {
        return Ingridients.query().$promise;
    };
    
    $scope.setIngridient = function (id) {
        
        Ingridients.get(
            {
                ingridientId: id
            }
        ).$promise.then(function (ingridient) {
            $scope.shelf.ingridientId = ingridient.id;
            $scope.info.caption = ingridient.caption;
            $scope.info.card = ingridient.infoCard;
            $scope.info.image = ingridient.image;

            $scope.shelf.measureId = ingridient.measureDefault;
            Measures.get(
                {
                    measureId: ingridient.measureDefault
                }
            ).$promise.then(function (measure) {
                $scope.info.measure = measure.caption;    
            });
        });
    };
    
    $scope.progressUpdate = function (shelf) {
        
        
        
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
                text: "Пусто",
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