angular.module('recipes').directive('measureselectcard', function (MeasureService) {
    'use strict';
    return {
        restrict: 'AE',
        scope: {
            measure: '=ngModel',
            editable: '=editable',
            asyncMeasures: '=cache'
        },
        require: 'ngModel',
        template:
            '<div>' +
                '<div ng-if="measure">' +
                    '<div class="list-group-item">' +
                        '<div class="row">' +
                            '<div ng-if="editable" class="btn btn-danger btn-xs" ng-click="selectMeasure()">' +
                                '<i class="glyphicon glyphicon-remove"></i>' +
                                'Изменить' +
                            '</div>' +
                            '<div class="col-md-3">' +
                                '<h4 class="list-group-item-heading" ng-bind="measure.caption"></h4>' +
                            '</div>' +
                            '<div ng-if="measure.step>0">' +
                                '<div class="col-md-4">' +
                                    '<div class="list-group-item-text">' +
                                        ' Мин. = <span ng-bind="measure.min"></span>,  шаг = <span ng-bind="measure.step"></span>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div ng-if="measure.step<=0">' +
                                '<div class="col-md-4">' +
                                    '<div class="list-group-item-text">' +
                                        'Неисчисляемая' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="col-md-4" ng-show="measure.converter">' +
                                'Конвертируется' +
                                '<div ng-repeat="converter in measure.converter">' +
                                    '<small ng-if="converter.uncountable || converter.rate<=0">' +
                                        '<span ng-bind="measure.caption"></span> ~ <span ng-bind="converter.caption"></span>' +
                                    '</small>' +
                                    '<small ng-if="!converter.uncountable && converter.rate>0">' +
                                        '<span ng-bind="measure.caption"></span> = <span ng-bind="converter.rate"></span> * <span ng-bind="converter.caption"></span>' +
                                    '</small>' +
                                '</div>' +
                            '</div>' +
                            '<div class="col-md-4" ng-hide="measure.converter">' +
                                'Не конвертируется' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div ng-if="!measure">' +
                    '<div ng-if="editable" class="input-group">' +
                        '<div class="input-group-addon">' +
                            '<i class="glyphicon glyphicon-search"></i>' +
                        '</div>' +
                        '<input type="text" ng-model="asyncMeasure" placeholder="Введите название"' +
                            ' typeahead="measure as measure.caption for measure in getAsyncMeasures($viewValue)" ' +
                            ' typeahead-loading="loadingMeasures" typeahead-no-results="noResultsMeasure"' +
                            ' typeahead-on-select="selectMeasure($item)" class="form-control">' +
                        '<i ng-show="loadingMeasures" class="glyphicon glyphicon-refresh"></i>' +
                        '<div ng-show="noResultsMeasure" class="input-group-addon">' +
                            '<i class="glyphicon glyphicon-remove"></i>' +
                            'Нет результатов' +
                        '</div>' +
                        '<div class="input-group-addon">' +
                            '<div ng-click="clearAsyncMeasure()">' +
                                '<i class="glyphicon glyphicon-remove"></i>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>',
        link: function (scope, iElement, iAttrs, ngModelController) {
            scope.getAsyncMeasures = function (value) {
                var matched = [];
                if (scope.asyncMeasures.length === 0) {
                    return MeasureService.query().$promise.then(function (results) {
                        scope.asyncMeasures = results;
                        results.forEach(function (item) {
                            if (item.caption.includes(value)) {
                                matched.push(item);
                            }
                        });
                        return matched;
                    });
                } else {
                    scope.asyncMeasures.forEach(function (item) {
                        if (item.caption.includes(value)) {
                            matched.push(item);
                        }
                    });
                    return matched;
                }
            };

            scope.selectMeasure = function (measure) {
                ngModelController.$setViewValue(measure);
            };

            scope.clearAsyncMeasure = function () {
                scope.asyncMeasure = '';
                scope.asyncMeasures = [];
            };
        }
    };
});
