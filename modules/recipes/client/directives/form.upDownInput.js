angular.module('recipes').directive('updowninput', function () {
    'use strict';
    return {
        restrict: 'AE',
        scope: {
            value: '=ngModel',
            min: '=min',
            max: '=max',
            step: '=step',
            precision: '=precision',
            measure: '=measure',
            convertable: '=convertable'
        },
        template: 
            '<div ng-hide="form.converting">' +
                '<div ng-hide="step > 0 || !step">' +
                    '<label class="btn btn-default" ng-click="form.converting=true">' +
                       '{{measure}}' +
                    '</label>' +
               '</div>' +
                '<div ng-show="(step > 0) || !step">' +
                    '<div ng-hide="form.input">' +
                        '<div class="btn-group">' +
                            '<label ng-show="measure && convertable" class="btn btn-default" ng-click="form.converting=true">' +
                                '{{measure}}' +
                            '</label>' +
                            '<label class="btn btn-default" ng-click="set(-1)">' +
                                '<i class="glyphicon glyphicon-minus"></i>' +
                            '</label>' +
                            '<label class="btn btn-default" ng-click="form.value=value;form.input = true">' +
                                '<div ng-show="!measure || (measure && convertable)">' +
                                    '{{value}}' +
                               '</div>' +
                                '<div ng-show="measure && !convertable">' +
                                    '{{value}} {{measure}}' +
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
                   '</div>' +
               '</div>' +
            '</div>' +
            '<div ng-show="form.converting">' +
                '<div class="btn-group">' +
                    '<label class="btn btn-default" ng-click="form.converting=false">' +
                        '<div ng-hide="step > 0">' +
                            '<i class="glyphicon glyphicon-menu-left"></i>{{value}}' +
                       '</div>' +
                        '<div ng-show="step > 0">' +
                            '<i class="glyphicon glyphicon-menu-left"></i>{{value}} {{measure}}' +
                       '</div>' +
                    '</label>' +
                    '<div class="btn-group" dropdown>' +
                        '<label class="btn btn-default">' +
                            '<div ng-hide="step > 0">' +
                                '<i class="glyphicon glyphicon-retweet"></i>{{newmeasure}}' +
                           '</div>' +
                            '<div ng-show="step > 0">' +
                                '<i class="glyphicon glyphicon-retweet"></i>{{newvalue}} {{newmeasure}}' +
                           '</div>' +
                        '</label>' +
                        '<label class="btn btn-default" dropdown-toggle>' +
                            '<span class="caret"></span>' +
                        '</label>' +
                        '<ul class="dropdown-menu" role="menu">' +
                            '<li role="menuitem"><a href="#">Action</a></li>' +
                            '<li role="menuitem"><a href="#">Another action</a></li>' +
                            '<li role="menuitem"><a href="#">Something else here</a></li>' +
                            '<li class="divider"></li>' +
                            '<li role="menuitem"><a href="#">Separated link</a></li>' +
                        '</ul>' +
                   '</div>' +
               '</div>' +
            '</div>',
        link: function (scope, iElement, iAttrs) {
            scope.set = function (sign, value) {
                var min = scope.min || 0,
                    max = scope.max || Number.MAX_VALUE,
                    step = scope.step || 1,
                    precision = scope.precision || 3,
                    oldValue = scope.value;
                scope.form = {
                    alert: false,
                    alertText : '',
                    value: scope.value
                };
                if (value) {
                    scope.value = Number((value).toFixed(precision));
                } else if (sign < 0) {
                    scope.value = Number((scope.value - step).toFixed(precision));
                } else {
                    scope.value = Number((scope.value + step).toFixed(precision));
                }
                if (scope.value < min) {
                    scope.value = oldValue;
                    scope.form.alert = true;
                    scope.form.alertText = '>=' + min + '!';
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