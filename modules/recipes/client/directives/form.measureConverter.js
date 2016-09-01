angular.module('recipes').directive('measureconverter', function (MeasureService) {
    'use strict';
    return {
        restrict: 'AE',
        scope: {
            value: '=ngModel',
            measure: '=',
            toggle: '=',
            precision: '='
        },
        require: 'ngModel',
        template: '<div ng-show="toggle">' +
                '<div class="btn-group">' +
                    '<label class="btn btn-default" ng-click="toggle=false">' +
                        '<div ng-hide="measure.step > 0">' +
                            '<i class="glyphicon glyphicon-menu-left"></i> {{measure.caption}}' +
                       '</div>' +
                        '<div ng-show="measure.step > 0">' +
                            '<i class="glyphicon glyphicon-menu-left"></i> {{value}} {{measure.caption}}' +
                       '</div>' +
                    '</label>' +
                    '<div class="btn-group" dropdown>' +
                        '<label class="btn btn-default" ng-click="apply()">' +
                                '{{newValue}} {{newCaption}} <i class="glyphicon glyphicon-retweet"></i>' +
                        '</label>' +
                        '<label class="btn btn-default" dropdown-toggle>' +
                            '<span class="caret"></span>' +
                        '</label>' +
                        '<ul class="dropdown-menu" role="menu">' +
                            '<li role="menuitem" ng-repeat="item in convertList">' +
                                '<a ng-click="selectItem($index)">' +
                                    '{{item.value}} {{item.caption}}' +
                                '</a>' +
                            '</li>' +
                        '</ul>' +
                    '</div>' +
                '</div>' +
            '</div>',
        link: function (scope, iElement, iAttrs, ngModelController) {
            var precision = scope.precision || 3,
                oldValue = scope.value;
            
            ngModelController.$render = function () {
                scope.convertList = [];
                if (!scope.measure) {
                    return;
                }
                scope.convertList = scope.getConvertList();
                if (scope.convertList.length === 0) {
                    scope.toggle = false; //measure is not convertable, so hiding directive
                    return;
                }
                scope.selectItem(0);
            };
            
            scope.getConvertList = function () {
                if (!scope.measure.converter) {
                    return [];
                }
                return scope.measure.converter.map(function (item, i, arr) {
                    return {
                        id: item.id,
                        value: (!item.uncountable && scope.value) ? Number((scope.value * item.rate).toFixed(precision)) : undefined,
                        caption: item.caption
                    };
                });
            };
            
            scope.selectItem = function (index) {
            
                MeasureService.get(
                    {
                        measureId: scope.convertList[index].id
                    }
                ).$promise.then(function (newMeasure) {
                    if (!newMeasure) {
                        return;
                    }
                    scope.newValue = newMeasure.applyValue(scope.convertList[index].value, precision);
                    scope.newCaption = newMeasure.caption;
                    scope.newMeasure = newMeasure;
                });
            };
            
            scope.apply = function () {
                scope.value = scope.newValue;
                scope.measure = scope.newMeasure;
                scope.toggle = false; //job is done, so hiding directive
            };
        }
    };
});