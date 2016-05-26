'use strict';

// Recipes controller
angular.module('recipes').controller('IngridientsController', 
                                     ['$scope', '$stateParams', '$location', '$window', '$timeout' ,'Authentication', 'Recipes','Ingridients','Measures', 'FileUploader',
    function($scope, $stateParams, $location, $window, $timeout, Authentication, Recipes, Ingridients, Measures, FileUploader) {
        
        $scope.authentication = Authentication;
        
        $scope.find = function() {
            $scope.ingridients = Ingridients.query();
        };
        
        $scope.findOne = function() {
            $scope.ingridient = Ingridients.get(
                {
                    ingridientId: $stateParams.ingridientId
                }
            );
        };
        
        $scope.getMeasuresList = function() {
            return Measures.query().$promise;
        };
        
        $scope.create = function(isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'ingridientForm');
                return false;
            }

            // Create new Recipe object

            var ingridient = new Ingridients(
                {
                    caption: this.caption,
                    infoCard: this.infoCard,
                    image: $scope.imageURL,
                    measureDefault: $scope.measureDefault
                }
            );

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
            ingridient.image = $scope.imageURL;
            ingridient.$update(function() {
                $location.path('ingridients/' + ingridient.id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        $scope.remove = function(ingridient) {
            if (ingridient) {
                ingridient.$remove();
                $location.path('ingridients');
            } else {
                $scope.ingridient.$remove(function() {
                    $location.path('ingridient');
                });
            }
        };
        
        var uploader = $scope.uploader = new FileUploader({
            url: '/api/pictures/ingridients'
        });

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        
            // Called after the user selected a new picture file
        $scope.uploader.onAfterAddingFile = function(fileItem) {
            if ($window.FileReader) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);
                
                fileReader.onload = function(fileReaderEvent) {
                    $timeout(function() {
                        $scope.imageURL = fileReaderEvent.target.result;
                    }, 0);
                };
            }
            console.log($scope.imageURL);
        };
    }                                  
]);