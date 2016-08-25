angular.module('recipes').directive('updowninput', function () {
    'use strict';
    return {
        restrict: 'AE',
        // declare the directive scope as private (and empty)
        scope: {
            value: '=ngModel',
            min: '=min',
            max: '=max',
            step: '=step',
            measure: '=measure'
        },
        // add behaviour to our buttons and use a variable value
        template: '<div ng-hide="form.input">' +
                '<div class="btn-group">' +
                    '<label class="btn btn-default" ng-click="set(-1)">' +
                        '<snap class="glyphicon glyphicon-minus"></snap>' +
                    '</label>' +
                    '<label class="btn btn-default" ng-click="form.value=value;form.input = true">' +
                        '{{value}} {{measure}}' +
                    '</label>' +
                    '<label class="btn btn-default" ng-click="set(1)">' +
                        '<snap class="glyphicon glyphicon-plus"></snap>' +
                    '</label>' +
                '</div>' +
            '</div>' +
            '<div ng-show="form.input">' +
                '<div class="input-group">' +
                    '<label class="input-group-addon">' +
                        '{{measure}}' +
                    '</label>' +
                    '<input name="input" type="number" ng-model="form.value" class="form-control">' +
                    '<label ng-show="form.alert" class="input-group-addon">' +
                        '{{form.alertText}}' +
                    '</label>' +
                    '<label class="input-group-addon" ng-click="set(0,form.value)">' +
                        'OK' +
                    '</label>' +
                '</div>' +
            '</div>',
        // this function is called on each rn-stepper instance initialisation
        // we just declare what we need in the above template
        link: function (scope, iElement, iAttrs) {
            scope.set = function (sign, value) {
                if (!scope.min) scope.min = 0;
                if (!scope.step) scope.step = 1;
                var oldValue = scope.value;
                if (value) {
                    scope.value = Number((value).toFixed(3));
                } else if (sign < 0) {
                    scope.value = Number((scope.value - scope.step).toFixed(3));
                } else {
                    scope.value = Number((scope.value + scope.step).toFixed(3));
                }
                if (scope.value < scope.min) {
                    scope.value = oldValue;
                    scope.form.alert = true;
                    scope.form.alertText = '>=' + scope.min + '!';
                } else {
                    scope.form = {
                        alert: false,
                        alertText : '',
                        input: false,
                        value: scope.value
                    };
                }
            };
        }
    };
});