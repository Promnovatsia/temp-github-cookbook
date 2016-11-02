angular.module('recipes').directive('shelfstatusbar', function () {
    'use strict';
    // progress bar settings
    const pbLimitEmpty = 10;
    const pbLimitDeficit = 20;
    const pbLengthDeficit = 20;
    const pbLimitDesired = 50;
    const pbLengthDesired = 30;
    const pbLimitMax = 80;
    const pbLenghtMax = 30;
    const pbMultyMax = 5;
    return {
        restrict: 'AE',
        scope: {
            progressbar: '=handle' //TODO refactor to fix error with attribute
        },
        require: 'ngModel',
        template:
            '<div>' +
                '<div ng-show="progressbar">' + //TODO ng-if
                    '<progressbar class="{{progressbar.class}}" value="progressbar.value" type="{{progressbar.type}}" max="100">' +
                        '<span style="color:white; white-space:nowrap;">' + 
                            '{{progressbar.text}}' +
                        '</span>' +
                    '</progressbar>' +
                '</div>' +
                '<div ng-hide="progressbar">' +
                    '' +
                '</div>' +
            '</div>',
        link: function (scope, iElement, iAttrs, ngModelController) {
            ngModelController.$render = function () { //TODO check if this is required
                scope.shelf = ngModelController.$viewValue;
                scope.progressUpdate();    
            };
            scope.$watch(function () {
                return ngModelController.$modelValue;
            }, function(newValue) {
                scope.progressUpdate();
            }, true);
            scope.progressUpdate = function() {
                if (!scope.shelf) return;
                if (scope.shelf.stored <= scope.shelf.deficit) {
                    scope.progressbar = 
                        {
                            type: 'danger',
                            text: scope.shelf.stored + " < " + scope.shelf.deficit,
                            value: pbLimitDeficit - pbLengthDeficit + 
                                ((scope.shelf.stored / scope.shelf.deficit) * pbLengthDeficit)    
                        };
                    if (scope.progressbar.value < pbLimitEmpty) {
                        scope.progressbar.value = pbLimitEmpty;
                    }
                } else if (scope.shelf.stored < scope.shelf.desired) {
                    scope.progressbar = 
                        {
                            type: 'warning',
                            text: scope.shelf.stored,
                            value: pbLimitDesired - pbLengthDesired + 
                                ((scope.shelf.stored - scope.shelf.deficit) / (scope.shelf.desired - scope.shelf.deficit) * pbLengthDesired)
                        };
                } else if (scope.shelf.stored <= scope.shelf.max) {
                    scope.progressbar = 
                        {
                            type: 'success',
                            text: scope.shelf.stored,
                            value: pbLimitMax - pbLenghtMax + 
                                ((scope.shelf.stored - scope.shelf.desired) / (scope.shelf.max - scope.shelf.desired) * pbLenghtMax)
                        };
                } else {
                    scope.progressbar = 
                        {
                            type: 'info',
                            text: scope.shelf.stored + " > " + scope.shelf.max,
                            value: pbLimitMax - pbMultyMax + 
                                (scope.shelf.stored / scope.shelf.max) * pbMultyMax
                        };
                    if (scope.progressbar.value > 100) { // 100%
                        scope.progressbar.value = 100; // set to 100%
                    }
                }
                if(scope.shelf.isSpoiled) {
                    scope.progressbar.class = "progress-striped active";
                }
            };
        }
    };
});
