angular.module('recipes').directive('updowninput', function () {
    'use strict';
    return {
        restrict: 'AE',
        scope: {
            value: '=ngModel',
            convertable: '=',
            min: '=',
            step: '=',
            precision: '=',
            converter: '=',
            measure: '=',
            validator: '&',
            validationId: '='
        },
        require: 'ngModel',
        template: '<div ng-hide="converter">' +
                '<div ng-hide="(measure.step > 0) || !measure">' +
                    '<label class="btn btn-default" ng-click="converter=true">' +
                        '{{measure.caption}}' +
                    '</label>' +
                '</div>' +
                '<div ng-show="(measure.step > 0) || !measure">' +
                    '<div ng-hide="form.input">' +
                        '<div class="btn-group">' +
                            '<label ng-show="convertable" class="btn btn-default" ng-click="converter=true">' +
                                '{{measure.caption}}' +
                            '</label>' +
                            '<label class="btn btn-default" ng-click="set(-1)">' +
                                '<i class="glyphicon glyphicon-minus"></i>' +
                            '</label>' +
                            '<label class="btn btn-default" ng-click="form.input = true">' +
                                '<div ng-show="convertable">' +
                                    '{{value}}' +
                                '</div>' +
                                '<div ng-hide="convertable">' +
                                    '{{value}} {{measure.caption}}' +
                                '</div>' +
                            '</label>' +
                            '<label class="btn btn-default" ng-click="set(1)">' +
                                '<i class="glyphicon glyphicon-plus"></i>' +
                            '</label>' +
                        '</div>' +
                    '</div>' +
                    '<div ng-show="form.input">' +
                        '<div class="input-group">' +
                            '<label ng-show="measure" class="input-group-addon">' +
                                '{{measure.caption}}' +
                            '</label>' +
                            '<input name="input" min="{{min}}" type="number" ng-model="form.value" class="form-control">' +
                            '<label ng-show="form.alert" class="input-group-addon">' +
                                '{{form.alertText}}' +
                            '</label>' +
                            '<label class="input-group-addon" ng-click="set(0,form.value)">' +
                                'OK' +
                            '</label>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>',
        link: function (scope, iElement, iAttrs, ngModelController) {
            
            var min, step, precision, oldValue;
            if (!scope.convertable) {
                min = (scope.min !== undefined) ? scope.min : 0;
                step = (scope.step !== undefined) ? scope.step : 1;
            }
            precision = (scope.precision !== undefined) ? scope.precision : 3;
            oldValue = scope.value;
            
            scope.$watch('measure', function (measure, oldValue) {
                if (measure) {
                    min = measure.min;
                    step = measure.step;
                    if (scope.convertable)
                        scope.convertable = measure.converter;
                }
            }, true);
            
            ngModelController.$render = function () {
                scope.form = {
                    alert: false,
                    alertText : '',
                    value: scope.value
                };
            };
            
            scope.set = function (sign, value) {
                scope.form = {
                    alert: false,
                    alertText : '',
                    value: scope.value
                };
                if (value !== undefined) {
                    scope.value = Number((value).toFixed(precision));
                } else if (sign < 0) {
                    scope.value = Number((scope.value - step).toFixed(precision));
                } else if (sign > 0) {
                    scope.value = Number((scope.value + step).toFixed(precision));
                }
                if (scope.value < min) {
                    scope.value = min;
                    scope.form.alert = true;
                    scope.form.alertText = '>=' + min + '!';
                } else {
                    scope.form = {
                        alert: false,
                        alertText : '',
                        input: false,
                        value: scope.value
                    };
                    scope.validator(
                        {
                            id: scope.validationId,
                            value: scope.value
                        }
                    );
                }
            };
        }
    };
});