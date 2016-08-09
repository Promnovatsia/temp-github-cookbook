'use strict';

angular
    .module('recipes')
    .controller('ShelfQueryController', ShelfQueryController);

ShelfQueryController.$inject = ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'ShelfQueryService', 'Ingridients', 'Measures'];

function ShelfQueryController($scope, $stateParams, $location, $window, Authentication, ShelfQueryService, Ingridients, Measures) {
        
    $scope.authentication = Authentication;
    $scope.error = null;
    $scope.info = {};
    $scope.form = {};

    $scope.imageurl = 'http://res.cloudinary.com/thomascookbook/image/upload/v1466671927/';
    
    $scope.find = function () {
        ShelfQueryService.query().$promise.then(function (shelfQueries) {
            /*shelfQueries.forEach(function (shelfQuery, i, arr) {
                $scope.progressUpdate(shelf);    
            });*/
            $scope.shelfQueries = shelfQueries;
        });
    };
    
    $scope.findOne = function () {
        if ($stateParams.shelfId && $stateParams.queryId) {
            ShelfQueryService.get(
                {
                    shelfId: $stateParams.shelfId,
                    queryId: $stateParams.queryId
                }
            ).$promise.then(function (shelfQuery) {
                Measures.get(
                    {
                        measureId: shelfQuery.measureId
                    }
                ).$promise.then(function (measure) {
                    $scope.info.measure = measure.caption;
                    $scope.info.step = measure.step;
                    $scope.info.min = measure.min;
                });
                $scope.shelfQuery = shelfQuery;
                $scope.settingsLoad();
            });    
        } else {
            //TODO new query from other then shelf    
        } 
    };
    
    $scope.settingsLoad = function () {
        
        $scope.form.buy = {
            alert: false,
            input: false,
            value: $scope.shelfQuery.buy
        };
        $scope.form.bought = {
            alert: false,
            input: false,
            value: $scope.shelfQuery.bought
        };
        $scope.form.use = {
            alert: false,
            input: false,
            value: $scope.shelfQuery.use
        };
        $scope.form.used = {
            alert: false,
            input: false,
            value: $scope.shelfQuery.used
        };
        $scope.form.spoil = {
            alert: false,
            input: false,
            value: $scope.shelfQuery.spoil
        };
        
    };
    
    $scope.setBuy = function (sign, value) {
        var oldValue = $scope.shelfQuery.buy;
        if (value !== 0) {
            $scope.shelfQuery.buy = Number((value).toFixed(3));
        } else if (sign < 0) {
            $scope.shelfQuery.buy = Number(($scope.shelfQuery.buy - $scope.info.step).toFixed(3));    
        } else {
            $scope.shelfQuery.buy = Number(($scope.shelfQuery.buy + $scope.info.step).toFixed(3)); 
        }
        if (1!==1){
            $scope.shelfQuery.buy = oldValue;
        } else {
            $scope.form.buy = {
                alert: false,
                input: false,
                value: $scope.shelfQuery.buy
            };
        }
    };
    
    $scope.setBought = function (sign, value) {
        var oldValue = $scope.shelfQuery.bought;
        if (value !== 0) {
            $scope.shelfQuery.bought = Number((value).toFixed(3));
        } else if (sign < 0) {
            $scope.shelfQuery.bought = Number(($scope.shelfQuery.bought - $scope.info.step).toFixed(3));    
        } else {
            $scope.shelfQuery.bought = Number(($scope.shelfQuery.bought + $scope.info.step).toFixed(3)); 
        }
        if (1!==1){
            $scope.shelfQuery.bought = oldValue;
        } else {
            $scope.form.bought = {
                alert: false,
                input: false,
                value: $scope.shelfQuery.bought
            };
        }
    };
    
    $scope.setUse = function (sign, value) {
        var oldValue = $scope.shelfQuery.use;
        if (value !== 0) {
            $scope.shelfQuery.use = Number((value).toFixed(3));
        } else if (sign < 0) {
            $scope.shelfQuery.use = Number(($scope.shelfQuery.use - $scope.info.step).toFixed(3));    
        } else {
            $scope.shelfQuery.use = Number(($scope.shelfQuery.use + $scope.info.step).toFixed(3)); 
        }
        if (1!==1){
            $scope.shelfQuery.use = oldValue;
        } else {
            $scope.form.use = {
                alert: false,
                input: false,
                value: $scope.shelfQuery.use
            };
        }
    };
    
    $scope.setUsed = function (sign, value) {
        var oldValue = $scope.shelfQuery.used;
        if (value !== 0) {
            $scope.shelfQuery.used = Number((value).toFixed(3));
        } else if (sign < 0) {
            $scope.shelfQuery.used = Number(($scope.shelfQuery.used - $scope.info.step).toFixed(3));    
        } else {
            $scope.shelfQuery.used = Number(($scope.shelfQuery.used + $scope.info.step).toFixed(3)); 
        }
        if (1!==1){
            $scope.shelfQuery.used = oldValue;
        } else {
            $scope.form.used = {
                alert: false,
                input: false,
                value: $scope.shelfQuery.used
            };
        }
    };
    
    $scope.setSpoil = function (sign, value) {
        var oldValue = $scope.shelfQuery.spoil;
        if (value !== 0) {
            $scope.shelfQuery.spoil = Number((value).toFixed(3));
        } else if (sign < 0) {
            $scope.shelfQuery.spoil = Number(($scope.shelfQuery.spoil - $scope.info.step).toFixed(3));    
        } else {
            $scope.shelfQuery.spoil = Number(($scope.shelfQuery.spoil + $scope.info.step).toFixed(3)); 
        }
        if (1!==1){
            $scope.shelfQuery.spoil = oldValue;
        } else {
            $scope.form.spoil = {
                alert: false,
                input: false,
                value: $scope.shelfQuery.spoil
            };
        }
    };
    
    $scope.remove = function () {
        if ($window.confirm('Are you sure you want to delete?')) {
            $scope.shelfQuery.$remove();
            $location.path('shelfQuery');    
        }
    };

    $scope.save = function (isValid) {
        
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'shelfQueryForm');
            return false;
        }
        
        /*console.log($scope.shelfQuery);
        $scope.shelfQuery.id = $scope.shelfQuery.number; */
        $scope.shelfQuery.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);

        function successCallback(res) {
            $location.path('shelf/' + $scope.shelfQuery.shelfId + '/query');
        }

        function errorCallback(res) {
            $scope.error = res.data.message;
        }
    };
}