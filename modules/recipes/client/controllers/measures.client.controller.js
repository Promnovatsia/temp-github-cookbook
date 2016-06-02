'use strict';

// Recipes controller
angular.module('recipes').controller('MeasuresController', 
                                     ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes','Ingridients', 'Measures',
    function($scope, $stateParams, $location, Authentication, Recipes, Ingridients, Measures) {
        
        $scope.authentication = Authentication;
        
        $scope.find = function() {
            $scope.measures = Measures.query();
        };
        
        $scope.findOne = function() {
            $scope.measure = Measures.get(
                {
                    measureId: $stateParams.measureId
                }
            );
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
                    min: this.min
                }
            );

            // Redirect after save
            measure.$save(function(response) {
                $location.path('measures/' + response.id);

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
            console.log(measure);
            measure.$update(function() {
                $location.path('measures/' + measure.id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
    }
]);