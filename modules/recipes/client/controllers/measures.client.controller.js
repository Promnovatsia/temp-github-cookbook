'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('MeasuresController', MeasuresController);
MeasuresController.$inject = ['$scope', '$stateParams', '$location', 'Authentication', 'MeasureService'];

function MeasuresController($scope, $stateParams, $location, Authentication, MeasureService) {
        
    $scope.authentication = Authentication;
    $scope.converter = [];
    
    $scope.find = function () {
        $scope.measures = MeasureService.query();
    };

    $scope.findOne = function () {
        if ($stateParams.measureId) {
            MeasureService.get(
                {
                    measureId: $stateParams.measureId
                }
            ).$promise.then(function (measure) {
                $scope.converter = measure.converter;
                $scope.measure = measure;
                $scope.uncountable = measure.step === 0;
                if ($scope.converter) {
                    $scope.converter.forEach(function (item, i, arr) {
                        item.index = i;
                    });
                }
            });
        } else {
            $scope.measure = new MeasureService(
                {
                    min: 0,
                    step: 1
                }
            );
        }
    };

    $scope.getMeasures = function (value) {
        return MeasureService.query().$promise.then(function (results) {
            var matched = [];
            results.forEach(function (item, i, arr) {
                if (item.caption.includes(value)) {
                    matched.push(item);
                }
            });
            return matched;
        });
    };
    
    $scope.addSubMeasure = function (subMeasure) {
        $scope.converter.push({
            id: subMeasure.id,
            index: $scope.converter.length,
            caption: subMeasure.caption,
            rate: 1,
            uncountable: subMeasure.step === 0
        });
        $scope.asyncSelected = "";
    };
    
    $scope.removeSubMeasure = function (index) {
        $scope.converter.splice(index, 1);
        $scope.converter.forEach(function (item, i, arr) {
            item.index = i;
        });
    };
    
    $scope.applyStep = function (id, step) {
        if (step <= 0) {
            $scope.uncountable = true;
        }
    };
    
    $scope.save = function (isValid) {
        
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'shelfForm');
            return false;
        }
        
        if ($scope.uncountable) {
            $scope.measure.step = 0;
            $scope.converter.forEach(function (item, i, arr) {
                item.rate = 0;
            });
        }
        $scope.measure.converter = $scope.converter;
        
        $scope.measure.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);

        function successCallback(res) {
            $location.path('measures');
        }

        function errorCallback(res) {
            $scope.error = res.data.message;
        }
    };
    
}