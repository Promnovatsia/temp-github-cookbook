//
// Copyright Kamil Pękala http://github.com/kamilkp
// angular-sortable-view v0.0.15c 2015/01/18
// forked from C0ZEN/angular-sortable-view fork of original
//

;(function(window, angular){
	'use strict';
	/* jshint eqnull:true */
	/* jshint -W041 */
	/* jshint -W030 */
    /* jshint -W116 */
    /* jshint -W003 */

	var module = angular.module('recipes');
	module.directive('svRoot', [function(){
		function shouldBeAfter(elem, pointer, isGrid){
			return isGrid ? elem.x - pointer.x < 0 : elem.y - pointer.y < 0;
		}
		function getSortableElements(key){
			return ROOTS_MAP[key];
		}
		function removeSortableElements(key){
			delete ROOTS_MAP[key];
		}

		var sortingInProgress;
		var ROOTS_MAP = Object.create(null);



		// window.ROOTS_MAP = ROOTS_MAP; // for debug purposes

		return {
			restrict: 'A',
			controller: ['$scope', '$attrs', '$interpolate', '$parse', function($scope, $attrs, $interpolate, $parse){


				//multi select

				this.MULTI_SELECT_LIST = [];

				this.multiSelectRaise = function(){
					for (var i=0;i<this.MULTI_SELECT_LIST.length;i++){
						this.MULTI_SELECT_LIST[i].element.addClass('sv-long-pressing');
					}
				};
				this.isMultiSelecting = function(){
					return this.MULTI_SELECT_LIST.length > 1;
				};

				this.clearMultiSelect = function(html){
						for (var i=0;i<this.MULTI_SELECT_LIST.length;i++){
							this.MULTI_SELECT_LIST[i].$multiSelected = false;
							this.MULTI_SELECT_LIST[i].element.removeClass('sv-element-multi-selected');
							this.MULTI_SELECT_LIST[i].element.removeClass('sv-long-pressing');
						}
						html.removeClass('sv-multi-selected');
						this.MULTI_SELECT_LIST=[];
					};

				 this.addToMultiSelect = function(sortableElement, multiScope, attr, html){
				 		for (var i=0;i<this.MULTI_SELECT_LIST.length;i++){
							if (this.MULTI_SELECT_LIST[i] === sortableElement){
								return false;
							}
						}
						sortableElement.$multiSelected = true;
						sortableElement.element.addClass('sv-element-multi-selected');
						sortableElement.multiScope = multiScope;
						sortableElement.attr = attr;
						html.addClass('sv-multi-selected');
						this.MULTI_SELECT_LIST.push(sortableElement);
						return true;
					};

				this.removeFromMultiSelect = function(sortableElement,html){
						sortableElement.$multiSelected = false;
						delete sortableElement.multiScope;
						delete sortableElement.attr;
						sortableElement.element.removeClass('sv-element-multi-selected');
						for (var i=0;i<this.MULTI_SELECT_LIST.length;i++){
							if (this.MULTI_SELECT_LIST[i] === sortableElement){
								this.MULTI_SELECT_LIST.splice(i,1);
								break;
							}
						}
						if (document.querySelectorAll('.sv-element-multi-selected').length === 0){
							html.removeClass('sv-multi-selected');
						}
					};

				this.getMultimodels = function(){
					var multiModels = [];
					var that = this;
					for (var i=0;i<that.MULTI_SELECT_LIST.length;i++){
						multiModels.push($parse(that.MULTI_SELECT_LIST[i].attr)(that.MULTI_SELECT_LIST[i].multiScope));
					}
					return multiModels;
				};


				var mapKey = $interpolate($attrs.svRoot)($scope) || $scope.$id;
				if(!ROOTS_MAP[mapKey]) ROOTS_MAP[mapKey] = [];

				var html = angular.element(document.documentElement);
				var that         = this;
				var candidates;  // set of possible destinations
				var $placeholder;// placeholder element
				var options;     // sortable options
				var $helper;     // helper element - the one thats being dragged around with the mouse pointer
				var $original;   // original element
				var $target;     // last best candidate
				var isGrid       = false;
				var isDisabled   = false;
				var onSort       = $parse($attrs.svOnSort);

				$scope.$watch($parse($attrs.svDisabled), function(newVal, oldVal) {
 					isDisabled = newVal;
 				});

				// ----- hack due to https://github.com/angular/angular.js/issues/8044
				$attrs.svOnStart = $attrs.$$element[0].attributes['sv-on-start'];
				$attrs.svOnStart = $attrs.svOnStart && $attrs.svOnStart.value;

				$attrs.svOnStop = $attrs.$$element[0].attributes['sv-on-stop'];
				$attrs.svOnStop = $attrs.svOnStop && $attrs.svOnStop.value;
				// -------------------------------------------------------------------

				var onStart = $parse($attrs.svOnStart);
				var onStop = $parse($attrs.svOnStop);

				this.mapKey = mapKey;

				this.sortingInProgress = function(){
					return sortingInProgress;
				};

				this.sortingDisabled = function() {
 					return isDisabled;
 				};

				if($attrs.svGrid){ // sv-grid determined explicite
					isGrid = $attrs.svGrid === "true" ? true : $attrs.svGrid === "false" ? false : null;
					if(isGrid === null)
						throw 'Invalid value of sv-grid attribute';
				}
				else{
					// check if at least one of the lists have a grid like layout
					$scope.$watchCollection(function(){
						return getSortableElements(mapKey);
					}, function(collection){
						isGrid = false;
						var array = collection.filter(function(item){
							return !item.container;
						}).map(function(item){
							return {
								part: item.getPart().id,
								y: item.element[0].getBoundingClientRect().top
							};
						});
						var dict = Object.create(null);
						array.forEach(function(item){
							if(dict[item.part])
								dict[item.part].push(item.y);
							else
								dict[item.part] = [item.y];
						});
						Object.keys(dict).forEach(function(key){
							dict[key].sort();
							dict[key].forEach(function(item, index){
								if(index < dict[key].length - 1){
									if(item > 0 && item === dict[key][index + 1]){
										isGrid = true;
									}
								}
							});
						});
					});
				}

				var stop = false;
		    var scroll = function (step, delay) {
		    		var el = document.querySelector('.main-ui-view');
		    		console.log("scrolling top", el.scrollTop);
		        el.scrollTop+=step;
		        if (!stop) {
		            setTimeout(function () {
                        scroll(step);
                    }, delay);
		        }
		    };

				this.$moveUpdate = function(opts, mouse, svElement, svOriginal, svPlaceholder, originatingPart, originatingIndex){
					var svRect = svElement[0].getBoundingClientRect();
					if(opts.tolerance === 'element')
						mouse = {
							x: ~~(svRect.left + svRect.width/2),
							y: ~~(svRect.top + svRect.height/2)
						};

					sortingInProgress = true;
					//console.log("move update");
					candidates = [];
					if(!$placeholder){
						if(svPlaceholder){ // custom placeholder
							$placeholder = svPlaceholder.clone();
							$placeholder.removeClass('ng-hide');
						}
						else{ // default placeholder
							$placeholder = svOriginal.clone();
							$placeholder.addClass('sv-visibility-hidden');
							$placeholder.addClass('sv-placeholder');
							$placeholder.css({
								'height': svRect.height + 'px',
								'width': svRect.width + 'px'
							});
						}

						svOriginal.after($placeholder);
						if (!that.keepInList){
							svOriginal.addClass('ng-hide');
						}

						// cache options, helper and original element reference
						$original = svOriginal;
						options = opts;
						$helper = svElement;

						onStart($scope, {
							$helper: {element: $helper},
							$part: originatingPart.model(originatingPart.scope),
							$index: originatingIndex,
							$item: originatingPart.model(originatingPart.scope)[originatingIndex]
						});
						$scope.$root && $scope.$root.$$phase || $scope.$apply();
					}
					var reposX = mouse.x + document.body.scrollLeft - mouse.offset.x*svRect.width;
					var reposY = mouse.y + document.body.scrollTop - mouse.offset.y*svRect.height;

					$helper[0].style.position ='fixed';
					// ----- move the element
					$helper[0].reposition({
						x: reposX,
						y: reposY
					});

					if (reposY <= 30){
						stop = false;
						scroll(-50, 200);
					} else if (reposY >= document.body.clientHeight - 60){
						stop = false;
						scroll(50, 200);
					} else {
						stop = true;
					}

					// ----- manage candidates
					getSortableElements(mapKey).forEach(function(se, index){
						if(opts.containment != null){
							// TODO: optimize this since it could be calculated only once when the moving begins
							if(
								!elementMatchesSelector(se.element, opts.containment) &&
								!elementMatchesSelector(se.element, opts.containment + ' *')
							) return; // element is not within allowed containment
						}

						var rect = se.element[0].getBoundingClientRect();
						var center = {
							x: ~~(rect.left + rect.width/2),
							y: ~~(rect.top + rect.height/2)
						};

						if(!se.container && // not the container element
							(se.element[0].scrollHeight || se.element[0].scrollWidth)){ // element is visible
							candidates.push({
								element: se.element,
								q: (center.x - mouse.x)*(center.x - mouse.x) + (center.y - mouse.y)*(center.y - mouse.y),
								view: se.getPart(),
								targetIndex: se.getIndex(),
								after: shouldBeAfter(center, mouse, isGrid)
							});
						}
						if(se.container && !se.element[0].querySelector('[sv-element]:not(.sv-placeholder):not(.sv-source)')){ // empty container
							candidates.push({
								element: se.element,
								q: (center.x - mouse.x)*(center.x - mouse.x) + (center.y - mouse.y)*(center.y - mouse.y),
								view: se.getPart(),
								targetIndex: 0,
								container: true
							});
						}
					});
					var pRect = $placeholder[0].getBoundingClientRect();
					var pCenter = {
						x: ~~(pRect.left + pRect.width/2),
						y: ~~(pRect.top + pRect.height/2)
					};
					candidates.push({
						q: (pCenter.x - mouse.x)*(pCenter.x - mouse.x) + (pCenter.y - mouse.y)*(pCenter.y - mouse.y),
						element: $placeholder,
						placeholder: true
					});
					candidates.sort(function(a, b){
						return a.q - b.q;
					});

					candidates.forEach(function(cand, index){
						if(index === 0 && !cand.placeholder && !cand.container){
							$target = cand;
							cand.element.addClass('sv-candidate');
							if(cand.after)
								cand.element.after($placeholder);
							else
								insertElementBefore(cand.element, $placeholder);
						}
						else if(index === 0 && cand.container){
							$target = cand;
							cand.element.append($placeholder);
						}
						else
							cand.element.removeClass('sv-candidate');
					});
				};

				this.$drop = function(originatingPart, index, options){
					stop=true;
					if(!$placeholder) return;

					if(options.revert){
						var placeholderRect = $placeholder[0].getBoundingClientRect();
						var helperRect = $helper[0].getBoundingClientRect();
						var distance = Math.sqrt(
							Math.pow(helperRect.top - placeholderRect.top, 2) +
							Math.pow(helperRect.left - placeholderRect.left, 2)
						);

						var duration = +options.revert*distance/200; // constant speed: duration depends on distance
						duration = Math.min(duration, +options.revert); // however it's not longer that options.revert

						['-webkit-', '-moz-', '-ms-', '-o-', ''].forEach(function(prefix){
							if(typeof $helper[0].style[prefix + 'transition'] !== "undefined")
								$helper[0].style[prefix + 'transition'] = 'all ' + duration + 'ms ease';
						});
						setTimeout(afterRevert, duration);
						$helper.css({
							'top': placeholderRect.top + document.body.scrollTop + 'px',
							'left': placeholderRect.left + document.body.scrollLeft + 'px'
						});
					}
					else
						afterRevert();

					function afterRevert(){
						sortingInProgress = false;
						$placeholder.remove();
						$helper.remove();
						$original.removeClass('ng-hide');

						candidates = void 0;
						$placeholder = void 0;
						options = void 0;
						$helper = void 0;
						$original = void 0;

						// sv-on-stop callback
						onStop($scope, {
							$part: originatingPart.model(originatingPart.scope),
							$index: index,
							$item: originatingPart.model(originatingPart.scope)[index]
						});

						var multiModels = that.getMultimodels();

						if($target){
							$target.element.removeClass('sv-candidate');
							var spliced = [originatingPart.model(originatingPart.scope)[index]];
							if (!that.keepInList){
								spliced = originatingPart.model(originatingPart.scope).splice(index, 1);
							}
							var targetIndex = $target.targetIndex;
							if($target.view === originatingPart && $target.targetIndex > index)
								targetIndex--;
							if($target.after)
								targetIndex++;

							if (multiModels.length ===0)
								multiModels =  spliced;

							for (var i =0;i<multiModels.length;i++){
								$target.view.model($target.view.scope).splice(targetIndex+i, 0, multiModels[i]);
							}

							var sortMethod;
							var destinationScope = $scope;
							var shouldSort = false;
							if(index != targetIndex){
								sortMethod = onSort;
								shouldSort = true;
							}
							// sv-on-sort callback
							if($target.view !== originatingPart){
								shouldSort = true;

								//if destination has sv-on-sort call it not the parent's
								if ($target.view.element && $target.view.element.attr("sv-on-external-sort")){
									destinationScope = $target.view.element.scope();
									var destinationOnSort = $parse($target.view.element.attr("sv-on-external-sort"));
									if (destinationOnSort){
										sortMethod = destinationOnSort;
									}
								}
							}

							if (sortMethod){
									sortMethod(destinationScope, {
										$partTo: $target.view.model($target.view.scope),
										$partFrom: originatingPart.model(originatingPart.scope),
										// $item: spliced[0],
										$items:multiModels,
										$indexTo: targetIndex,
										$indexFrom: index
									});
							}
							if (shouldSort){
								var $viewEl = $target.view.element;
								$viewEl.addClass("sv-dropped");
								setTimeout(function(){
									$viewEl.removeClass("sv-dropped");
									$viewEl = void 0;
									that.clearMultiSelect(html);
								},300);
							}
						}
						$target = void 0;

						$scope.$root && $scope.$root.$$phase || $scope.$apply();
					}
				};

				this.addToSortableElements = function(se){
					getSortableElements(mapKey).push(se);
				};
				this.removeFromSortableElements = function(se){
					var elems = getSortableElements(mapKey);
					var index = elems.indexOf(se);
					if(index > -1){
						elems.splice(index, 1);
						if(elems.length === 0)
							removeSortableElements(mapKey);
					}
				};
			}]
		};
	}]);

	module.directive('svPart', ['$parse', function($parse){

			return {
			restrict: 'A',
			require: '^svRoot',
			controller: ['$scope', function($scope){
				$scope.$ctrl = this;
				this.getPart = function(){
					return $scope.part;
				};
					this.$drop = function(index, options){
						$scope.$sortableRoot.$drop($scope.part, index, options);
					};
			}],
			scope: true,
			link: function($scope, $element, $attrs, $sortable){
				var html = angular.element(document.documentElement);
				if(!$attrs.svPart) throw new Error('no model provided');
				var model = $parse($attrs.svPart);
				if(!model.assign) throw new Error('model not assignable');
				$sortable.keepInList = $parse($attrs.svKeepInList)($scope);
				$scope.$ctrl.isDropzone = $parse($attrs.svIsDropzone)($scope) !== false;
				$scope.$ctrl.multiSelect = $parse($attrs.svMultiSelect)($scope) === true;

				if($scope.$ctrl.multiSelect){
					$element.on('mousedown',function(){
						$sortable.clearMultiSelect(html);
					});
				}
				$scope.part = {
					id: $scope.$id,
					element: $element,
					model: model,
					scope: $scope
				};
				$scope.$sortableRoot = $sortable;

				var sortablePart = {
					element: $element,
					getPart: $scope.$ctrl.getPart,
					container: true
				};

				if ($scope.$ctrl.isDropzone){
					$sortable.addToSortableElements(sortablePart);
				}
				$scope.$on('$destroy', function(){
					$sortable.removeFromSortableElements(sortablePart);
				});
			}
		};
	}]);

	module.directive('svElement', ['$parse','svDragging', function($parse, svDragging){
		return {
			restrict: 'A',
			require: ['^svPart', '^svRoot'],
			controller: ['$scope', function($scope){
				$scope.$ctrl = this;
			}],
			link: function($scope, $element, $attrs, $controllers){



				var sortableElement = {
					element: $element,
					getPart: $controllers[0].getPart,
					getIndex: function(){
						return $scope.$index;
					}
				};
				if ($controllers[0].isDropzone){
					$controllers[1].addToSortableElements(sortableElement);
				}
				$scope.$on('$destroy', function(){
					$controllers[1].removeFromSortableElements(sortableElement);
				});

				var startTimer;
				var clearEvent = function () {
					svDragging.isDragging = false;
				  clearTimeout(startTimer);
			 	};

		 	  var event = function (e) {
		 	  	function setMulti(ev){
		 	    	if (!moveExecuted && $controllers[0].multiSelect){
			 	    	if (ev.ctrlKey || ev.metaKey){
			 	    		if(sortableElement.$multiSelected){
			 	    			$controllers[1].removeFromMultiSelect(sortableElement, html);
			 	    		} else {
			 	    			$controllers[1].addToMultiSelect(sortableElement, $scope, $attrs.svElement, html);
			 	    		}
			 	    	} else if (!sortableElement.$multiSelected){
			 	    		$controllers[1].clearMultiSelect(html);
			 	    		$controllers[1].addToMultiSelect(sortableElement, $scope,$attrs.svElement, html);
			 	    	}
			 	    }
		 	  	}

		 	  	//ignore other buttons
		 	  	var evt = (e==null ? event:e);
		 	  	if (evt && (evt.which>1 || evt.button>2)){
		 	  		return true;
		 	  	}
		 	  	if($controllers[1].sortingDisabled()){
		 	  		return true;
		 	  	}
		 	    html.on('mouseup touchend', function mouseup(e){
		 	    	setMulti(e);
		 	    	clearEvent();
		 	    	html.off('mouseup touchend', mouseup);
		 	    });

		 	    startTimer = setTimeout(function () {
		 	    	setMulti(e);
	 	    		onMousedown(e);
 	    		}, 300);
 	    		e.preventDefault();
 	    		e.stopPropagation();
 	    		return false;
		 	  };

				// assume every element is draggable unless specified
				$scope.$watch($parse($attrs.svElementDisabled), function(newVal, oldVal) {
					if (newVal){
						resetOnStartEvent(false, event);
					} else {
						resetOnStartEvent($element, event);
					}

 				});

				var handle = $element;

				handle.on('mousedown touchstart', event);
				$scope.$watch('$ctrl.handle', function(customHandle){
					if(customHandle){
						resetOnStartEvent(customHandle, event);
					}
				});

				var helper;
				$scope.$watch('$ctrl.helper', function(customHelper){
					if(customHelper){
						helper = customHelper;
					}
				});

				var placeholder;
				$scope.$watch('$ctrl.placeholder', function(customPlaceholder){
					if(customPlaceholder){
						placeholder = customPlaceholder;
					}
				});

				var body = angular.element(document.body);
				var html = angular.element(document.documentElement);

				var moveExecuted;


				function resetOnStartEvent(newHandle, event){
					if (newHandle){
							handle.off('mousedown touchstart', event);
							handle = newHandle;
							handle.on('mousedown touchstart', event);
							
					} else {
						handle.off('mousedown touchstart', event);
					}
				}

				function onMousedown(e){
					if (svDragging.isDragging){
						return;
					}

					if ($controllers[0].multiSelect && !sortableElement.$multiSelect){
						$controllers[1].addToMultiSelect(sortableElement, $scope, $attrs.svElement, html);
						$controllers[1].multiSelectRaise();
					} else {
						$element.addClass('sv-long-pressing');
					}


					svDragging.isDragging = true;
					touchFix(e);

					if($controllers[1].sortingInProgress()) return;
					if($controllers[1].sortingDisabled()) return;
					if(e.button != 0 && e.type === 'mousedown') return;

					moveExecuted = false;
					var opts = $parse($attrs.svElement)($scope);
					opts = angular.extend({}, {
						tolerance: 'pointer',
						revert: 200,
						containment: 'html'
					}, opts);
					if(opts.containment){
						var containmentRect = closestElement.call($element, opts.containment)[0].getBoundingClientRect();
					}

					var target = $element;
					var clientRect = $element[0].getBoundingClientRect();
					var clone;
					if(!helper) helper = $controllers[0].helper;
					if(!placeholder) placeholder = $controllers[0].placeholder;
					if(helper){
						clone = helper.clone();
						clone.removeClass('ng-hide');
						clone.css({
							'left': clientRect.left + document.body.scrollLeft + 'px',
							'top': clientRect.top + document.body.scrollTop + 'px'
						});
							target.addClass('sv-visibility-hidden');
					} else if ($controllers[1].isMultiSelecting()){
						clone = angular.element(document.querySelector("#sv-multi-helper")).clone();
						var models = $controllers[1].getMultimodels();
						clone[0].querySelector(".card-title-text").innerHTML = target[0].querySelector(".card-title-text").innerHTML;

						clone[0].querySelector(".badge").innerHTML = $controllers[1].MULTI_SELECT_LIST.length;
						clone.addClass('sv-helper').css({
							'left': clientRect.left + document.body.scrollLeft + 'px',
							'top': clientRect.top + document.body.scrollTop + 'px',
							'width': clientRect.width + 'px'
						});
					}
					else{
						clone = target.clone();
						clone.removeClass("sv-element-multi-selected");
						clone.addClass('sv-helper').css({
							'left': clientRect.left + document.body.scrollLeft + 'px',
							'top': clientRect.top + document.body.scrollTop + 'px',
							'width': clientRect.width + 'px'
						});
					}

					clone[0].reposition = function(coords){
						var targetLeft = coords.x;
						var targetTop = coords.y;
						var helperRect = clone[0].getBoundingClientRect();

						var body = document.body;

						if(containmentRect){
							if(targetTop < containmentRect.top + body.scrollTop) // top boundary
								targetTop = containmentRect.top + body.scrollTop;
							if(targetTop + helperRect.height > containmentRect.top + body.scrollTop + containmentRect.height) // bottom boundary
								targetTop = containmentRect.top + body.scrollTop + containmentRect.height - helperRect.height;
							if(targetLeft < containmentRect.left + body.scrollLeft) // left boundary
								targetLeft = containmentRect.left + body.scrollLeft;
							if(targetLeft + helperRect.width > containmentRect.left + body.scrollLeft + containmentRect.width) // right boundary
								targetLeft = containmentRect.left + body.scrollLeft + containmentRect.width - helperRect.width;
						}
						this.style.left = targetLeft - body.scrollLeft + 'px';
						this.style.top = targetTop - body.scrollTop + 'px';
					};

					var pointerOffset = {
						x: (e.clientX - clientRect.left)/clientRect.width,
						y: (e.clientY - clientRect.top)/clientRect.height
					};
					html.addClass('sv-sorting-in-progress');

					var dropzoneClass = 'sv-sorting-'+$controllers[1].mapKey;
					html.addClass(dropzoneClass);

					html.on('mousemove touchmove', onMousemove).on('mouseup touchend touchcancel', function mouseup(e){
						svDragging.isDragging = false;
						html.off('mousemove touchmove', onMousemove);
						html.off('mouseup touchend', mouseup);

						// timeout so animation goes to the right element
						setTimeout(function(){
							html.removeClass('sv-sorting-in-progress');
							html.removeClass(dropzoneClass);
						},500);

						if(moveExecuted){
							$controllers[0].$drop($scope.$index, opts);
							moveExecuted = false;
						}
						$element.removeClass('sv-visibility-hidden');
						if (!$controllers[0].multiSelect){
							setTimeout(function(){
								target.removeClass('sv-long-pressing');
							},300);
						} else {
							if ($controllers[1].MULTI_SELECT_LIST.length === 1){
								$controllers[1].clearMultiSelect(html);
							}
						}
					});

					// onMousemove(e);
					function onMousemove(e){
						touchFix(e);
						if(!moveExecuted){
							body.prepend(clone);
							moveExecuted = true;
						}
						$controllers[1].$moveUpdate(opts, {
							x: e.clientX,
							y: e.clientY,
							offset: pointerOffset
						}, clone, $element, placeholder, $controllers[0].getPart(), $scope.$index);
						e.stopPropagation();
						e.preventDefault();
						return false;
					}
				}
			}
		};
	}]);

	module.directive('svHandle', function(){
		return {
			require: '?^svElement',
			link: function($scope, $element, $attrs, $ctrl){
				if($ctrl)
					$ctrl.handle = $element.add($ctrl.handle); // support multiple handles
			}
		};
	});

	module.directive('svHelper', function(){
		return {
			require: ['?^svPart', '?^svElement'],
			link: function($scope, $element, $attrs, $ctrl){
				$element.addClass('sv-helper').addClass('ng-hide');
				if($ctrl[1])
					$ctrl[1].helper = $element;
				else if($ctrl[0])
					$ctrl[0].helper = $element;
			}
		};
	});

	module.directive('svPlaceholder', function(){
		return {
			require: ['?^svPart', '?^svElement'],
			link: function($scope, $element, $attrs, $ctrl){
				$element.addClass('sv-placeholder').addClass('ng-hide');
				if ($ctrl[1] && $ctrl[0]){
					//find closest svPart or svElement and set placeholder in the correct place
					var p = $element.parent();
					while (p.length > 0) {
					  if (p[0].hasAttribute('sv-element')){
					  	$ctrl[1].placeholder = $element;
					  	return;
					  } else if (p[0].hasAttribute('sv-part')){
					  	$ctrl[0].placeholder = $element;
					  	return;
					  }
					  p = p.parent();
					}
				} else if($ctrl[1])
					$ctrl[1].placeholder = $element;
				else if($ctrl[0])
					$ctrl[0].placeholder = $element;
			}
		};
	});

	module.service('svDragging', function(){
		this.isDragging = false;
	});

	angular.element(document.head).append([
		'<style>' +
		'.sv-helper{' +
			'position: fixed !important;' +
			'z-index: 99999;' +
			'margin: 0 !important;' +
		'}' +
		'.sv-candidate{' +
		'}' +
		'.sv-placeholder{' +
			// 'opacity: 0;' +
		'}' +
		'.sv-sorting-in-progress{' +
			'-webkit-user-select: none;' +
			'-moz-user-select: none;' +
			'-ms-user-select: none;' +
			'user-select: none;' +
		'}' +
		'.sv-visibility-hidden{' +
			'visibility: hidden !important;' +
			'opacity: 0 !important;' +
		'}' +
		'</style>'
	].join(''));

	function touchFix(e){
		if(!('clientX' in e) && !('clientY' in e)) {
			var touches = e.touches || e.originalEvent.touches;
			if(touches && touches.length) {
				e.clientX = touches[0].clientX;
				e.clientY = touches[0].clientY;
			}
			e.preventDefault();
		}
	}

	function getPreviousSibling(element){
		element = element[0];
		if(element.previousElementSibling)
			return angular.element(element.previousElementSibling);
		else{
			var sib = element.previousSibling;
			while(sib != null && sib.nodeType != 1)
				sib = sib.previousSibling;
			return angular.element(sib);
		}
	}

	function insertElementBefore(element, newElement){
		var prevSibl = getPreviousSibling(element);
		if(prevSibl.length > 0){
			prevSibl.after(newElement);
		}
		else{
			element.parent().prepend(newElement);
		}
	}

	var dde = document.documentElement,
	matchingFunction = dde.matches ? 'matches' :
						dde.matchesSelector ? 'matchesSelector' :
						dde.webkitMatches ? 'webkitMatches' :
						dde.webkitMatchesSelector ? 'webkitMatchesSelector' :
						dde.msMatches ? 'msMatches' :
						dde.msMatchesSelector ? 'msMatchesSelector' :
						dde.mozMatches ? 'mozMatches' :
						dde.mozMatchesSelector ? 'mozMatchesSelector' : null;
	if(matchingFunction == null)
		throw 'This browser doesn\'t support the HTMLElement.matches method';

	function elementMatchesSelector(element, selector){
		if(element instanceof angular.element) element = element[0];
		if(matchingFunction !== null)
			return element[matchingFunction](selector);
	}

	var closestElement = angular.element.prototype.closest || function (selector){
		var el = this[0].parentNode;
		while(el !== document.documentElement && !el[matchingFunction](selector))
			el = el.parentNode;

		if(el[matchingFunction](selector))
			return angular.element(el);
		else
			return angular.element();
	};

	/*
		Simple implementation of jQuery's .add method
	 */
	if(typeof angular.element.prototype.add !== 'function'){
		angular.element.prototype.add = function(elem){
			var i, res = angular.element();
			elem = angular.element(elem);
			for(i=0;i<this.length;i++){
				res.push(this[i]);
			}
			for(i=0;i<elem.length;i++){
				res.push(elem[i]);
			}
			return res;
		};
	}

})(window, window.angular);
