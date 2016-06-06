'use strict';

// Recipes controller
angular.module('recipes').controller('MeasuresController', 
                                     ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes','Ingridients', 'Measures',
    function($scope, $stateParams, $location, Authentication, Recipes, Ingridients, Measures) {
        
        $scope.authentication = Authentication;
        $scope.converter=[];
        
        $scope.uncountable=false;
        $scope.find = function() {
            $scope.measures = Measures.query();
        };
        
        $scope.findOne = function() {
            $scope.measure = Measures.get(
                {
                    measureId: $stateParams.measureId
                }
            ).$promise.then(function (measure){
                $scope.converter=measure.converter;
                console.log($scope.converter);
                $scope.measure=measure;
                $scope.converter.forEach(function(item, i, arr) {
                    item.index = i;
                });
            });
        };
        
        $scope.getMeasuresList = function() {
            return Measures.query().$promise;
        };
        
        $scope.minMinus = function(measure) {
            measure.min--;
            if (measure.min<0){
                measure.min=0;
            }
        };
        
        $scope.minPlus = function(measure) {
            measure.min++;
        };
        
        $scope.stepMinus = function(measure) {
            measure.step--;
            if (measure.step<0){
                measure.step=0;
            }
        };
        
        $scope.stepPlus = function(measure) {
            measure.step++;
        };
        
        $scope.newSubMeasure = function(id){
            if(!id || id % 1 !== 0) {
                $scope.selectedMeasure='';
                return;
            }
            Measures.get(
                {
                    measureId: id
                }
            ).$promise.then(function(measure) {
                $scope.converter.push({
                    id: measure.id,
                    index: $scope.converter.length,
                    caption: measure.caption,
                    rate: 1,
                    exchange: true
                });
                $scope.converter.forEach(function(item, i, arr) {
                    item.index = i;
                });
            });
            $scope.selectedMeasure='';
        };
        
        $scope.removeSubMeasure = function(node){
            $scope.converter.splice(node.index,1);
            $scope.converter.forEach(function(item, i, arr) {
                item.index = i;
            });
        };
        
        $scope.create = function(isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'ingridientForm');
                return false;
            }

            // Create new Recipe object

            var measure = new Measures(
                {
                    caption: this.caption,
                    step: this.step,
                    min: this.min,
                    converter: []
                }
            );
            $scope.converter.forEach(function(item, i, arr) {
                if(!item.exchange || $scope.uncountable){
                    item.rate=0;
                }
                measure.converter.push(
                    {
                        id:item.id,
                        caption:item.caption,
                        rate: item.rate
                    }
                );    
            });
            console.log($scope.converter);
            console.log(measure);
            // Redirect after save
            measure.$save(function(response) {
                $location.path('measures');

            // Clear form fields
                $scope.caption = '';
                $scope.step = '';
                $scope.min = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        $scope.update = function(isValid) {
            
            $scope.error = null;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'measureForm');
                return false;
            }

            var measure = $scope.measure;
            measure.converter=[];
            $scope.converter.forEach(function(item, i, arr) {
                if(!item.exchange || $scope.uncountable){
                    item.rate=0;
                }
                measure.converter.push(
                    {
                        id:item.id,
                        caption:item.caption,
                        rate: item.rate
                    }
                );    
            });
            console.log($scope.converter);
            console.log(measure);
            measure.$update(function() {
                $location.path('measures');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
    }
]);