'use strict';

// Recipes controller
angular.module('recipes').controller('IngridientsController', 
                                     ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes','Ingridients',
    function($scope, $stateParams, $location, Authentication, Recipes, Ingridients) {
        
        $scope.authentication = Authentication;
        
        
        $scope.find = function() {
            $scope.ingridients = Ingridients.query();
        };
        
        $scope.findOne = function() {
            $scope.ingridient = Ingridients.get({
                ingridientId: $stateParams.ingridientId
            });
        };
        
        $scope.create = function(isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'ingridientForm');
                return false;
            }

            // Create new Recipe object

            var ingridient = new Ingridients({
                caption: this.caption,
                infoCard: this.infoCard,
            });

            // Redirect after save
            ingridient.$save(function(response) {
                $location.path('ingridients/' + response.id);

            // Clear form fields
                $scope.caption = '';
                $scope.infoCard = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        $scope.update = function(isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'ingridientForm');
                return false;
            }

            var ingridient = $scope.ingridient;
            ingridient.$update(function() {
                $location.path('ingridients/' + ingridient.id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
}                                  
]);