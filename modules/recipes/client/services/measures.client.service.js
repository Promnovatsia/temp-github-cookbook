'use strict';

//Measures service used for communicating with the measures REST endpoints
angular.module('recipes').factory('Measures', ['$resource',
    function ($resource) {
        return $resource('api/measures/:measureId', {
            measureId: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

//Measure service used for communicating with the measure REST endpoints
angular
    .module('recipes')
    .factory('MeasureService', MeasureService);

MeasureService.$inject = ['$resource'];

function MeasureService($resource) {
    var Measure = $resource('api/measures/:measureId', {
        measureId: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
    
    angular.extend(Measure.prototype, {
        createOrUpdate: function () {
            var measure = this;
            return createOrUpdate(measure);
        },
        applyValue: function (value, precision) {
            var measure = this;
            return applyValue(measure, value, precision);
        }
    });
    
    return Measure;
    
    function createOrUpdate(measure) {
        if (measure.id) {
            return measure.$update(onSuccess, onError);
        } else {
            return measure.$save(onSuccess, onError);
        }
    }
    
    function applyValue(measure, value, toFixed) {
        
        if (measure.step <= 0)
            return undefined;
        
        var result = value || 0,
            precision = toFixed || 3;
        if (value % measure.step > 0) {
            result = Number((value - value % measure.step + measure.step).toFixed(precision));
        }
        if (result < measure.min) {
            result = measure.min;
        }
        return result;
    }
    
    function onSuccess(measure) {
        // Any required internal processing from inside the service, goes here.    
    }
    
    // Handle error response
    function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
    }

    function handleError(error) {
        // Log error
        console.log(error);
    }
}