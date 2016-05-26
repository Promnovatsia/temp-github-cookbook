'use strict';

// Recipes controller
angular.module('recipes').controller('MeasuresController', 
                                     ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes','Ingridients', 'Measures',
    function($scope, $stateParams, $location, Authentication, Recipes, Ingridients, Measures) {
        
        $scope.authentication = Authentication;
        
        $scope.find = function() {
            $scope.measures = Measures.query();
        };
        
        $scope.update = function(isValid) {
            
            $scope.error = null;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'measureForm');
                return false;
            }

            var measures = $scope.measures;
            console.log(measures);
            measures.$update(function() {
                $location.path('measures/');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
    }
]);