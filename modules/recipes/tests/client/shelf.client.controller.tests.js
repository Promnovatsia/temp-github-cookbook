'use strict';

(function() {
    // Recipes Controller Spec
    describe('Shelf Controller Tests', function() {
        // Initialize global variables
        var ShelfController,
            scope,
            $httpBackend,
            $stateParams,
            $location,
            $window,
            Authentication,
            ShelfService,
            RequestService,
            IngredientService,
            MeasureService,
            mockShelf,
            mockIngredient,
            mockMeasure;

        // The $resource service augments the response object with methods for updating and deleting the resource.
        // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
        // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
        // When the toEqualData matcher compares two objects, it takes only object properties into
        // account and ignores methods.
        beforeEach(function() {
            jasmine.addMatchers({
                toEqualData: function(util, customEqualityTesters) {
                    return {
                        compare: function(actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        // Then we can start by loading the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
        // This allows us to inject a service but then attach it to a variable
        // with the same name as the service.
        beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$stateParams_, _$location_, _$window_, _Authentication_, _ShelfService_, _RequestService_, _IngredientService_, _MeasureService_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $httpBackend = _$httpBackend_;
            $stateParams = _$stateParams_;
            $location = _$location_;
            Authentication = _Authentication_;
            ShelfService = _ShelfService_;
            RequestService = _RequestService_;
            IngredientService = _IngredientService_;
            MeasureService = _MeasureService_;

            // create mock recipe
            mockShelf = new ShelfService(
                {
                    id: 12345,
                    stored: 15,
                    desired: 25,
                    max: 30,
                    deficit: 10
                }
            );

            mockIngredient = new IngredientService(
                {
                    id: 10000,
                    caption: "mockIngredient",
                    measureDefault: 10000
                }
            );

            mockMeasure = new MeasureService(
                {
                    id: 10000,
                    caption: "mockMeasure"
                }
            );

            // Mock logged in user
            Authentication.user = {
                roles: ['admin, user']
            };

            // Initialize the Recipes controller.
            ShelfController = $controller('ShelfController', {
                $scope: scope
            });
        }));

        it('$scope.find() should create an array with at least one shelf object fetched from XHR', inject(function(ShelfService) {
            // Create a sample shelves array that includes the new shelf
            var sampleShelves = [mockShelf];

            // Set GET response
            $httpBackend.expectGET('api/shelf').respond(sampleShelves);

            // Run controller functionality
            scope.find();
            $httpBackend.flush();

            // Test scope value
            expect(scope.shelves).toEqualData(sampleShelves);
        }));

        describe('$scope.findOne()', function() {

            it('should create an array with one shelf object fetched from XHR using a shelfId URL parameter', inject(function(ShelfService) {
                // Set the URL parameter
                $stateParams.shelfId = mockShelf.id;

                // Set GET response
                $httpBackend.expectGET(/api\/shelf\/([0-9]{5})$/).respond(mockShelf);

                // Run controller functionality
                scope.findOne();
                $httpBackend.flush();

                // Test scope value
                expect(scope.shelf).toEqualData(mockShelf);
            }));

            it('should not request ingredient if ingredientId is null', inject(function(ShelfService) {
                // Set the URL parameter
                $stateParams.shelfId = mockShelf.id;
                //mockShelf.ingredientId = null;

                // Set GET response
                $httpBackend.expectGET(/api\/shelf\/([0-9]{5})$/).respond(mockShelf);

                // Run controller functionality
                scope.findOne();
                $httpBackend.flush();

                // Test scope value

                expect(scope.ingredient).toBe(undefined);
            }));

            it('should not set shelf ingredient if ingredientId is incorrect', inject(function(ShelfService) {
                // Set the URL parameter

                $stateParams.shelfId = mockShelf.id;
                mockShelf.ingredientId = mockIngredient.id;

                // Set GET response
                $httpBackend.expectGET(/api\/shelf\/([0-9]{5})$/).respond(mockShelf);
                $httpBackend.expectGET(/api\/ingredients\/([0-9]{5})$/).respond(null);
                // Run controller functionality
                scope.findOne();
                $httpBackend.flush();

                // Test scope value
                expect(scope.ingredient).toBe(null);
            }));

            it('should correctly set shelf ingredient and its measure', inject(function(ShelfService) {
                // Set the URL parameter

                $stateParams.shelfId = mockShelf.id;
                mockShelf.ingredientId = mockIngredient.id;

                // Set GET response
                $httpBackend.expectGET(/api\/shelf\/([0-9]{5})$/).respond(mockShelf);
                $httpBackend.expectGET(/api\/ingredients\/([0-9]{5})$/).respond(mockIngredient);
                $httpBackend.expectGET(/api\/measures\/([0-9]{5})$/).respond(mockMeasure);

                // Run controller functionality
                scope.findOne();
                $httpBackend.flush();

                // Test scope value
                expect(scope.shelf).toEqualData(mockShelf);
                expect(scope.ingredient.id).toBe(mockIngredient.id);
                expect(scope.measure.id).toBe(mockMeasure.id);
            }));
        });

        describe('$scope.save() as create', function() {
            var sampleShelfPostData;

            beforeEach(function() {
                // Create a sample recipe object
                sampleShelfPostData = new ShelfService({
                    caption: 'Testing shelf'
                });

                spyOn($location, 'path');
            });

            it('should send a POST request with the form input values and then locate to new object URL', inject(function(ShelfService) {
                // Set POST response
                sampleShelfPostData.place = "simple POST from input";
                $httpBackend.expectPOST('api/shelf', sampleShelfPostData).respond(mockShelf);

                // Run controller functionality
                scope.shelf = sampleShelfPostData;
                scope.save(true);
                $httpBackend.flush();

                // Test URL redirection after the shelf was created
                expect($location.path.calls.mostRecent().args[0]).toBe('shelf/' + mockShelf.id);
            }));

            it('should set scope.error if save error', function() {
                var errorMessage = 'this is an error message';
                $httpBackend.expectPOST('api/shelf', sampleShelfPostData).respond(400, {
                    message: errorMessage
                });
                scope.shelf = sampleShelfPostData;
                scope.save(true);
                $httpBackend.flush();

                expect(scope.error).toBe(errorMessage);
            });
        });

        describe('$scope.save() as update', function() {
            beforeEach(function() {
                // Mock shelf in scope
                scope.shelf = mockShelf;
            });

            it('should not update a valid shelf without userId', inject(function(ShelfService) {
                // Set PUT response
                $httpBackend.expectPUT(/api\/shelf\/([0-9]{5})$/).respond(mockShelf);

                // Run controller functionality
                scope.save(true);
                $httpBackend.flush();

                // Test URL location to new object
                expect($location.path()).toBe('/forbidden'); //TODO find out the problem with update
                //expect($location.path()).toBe('/shelf/' + mockShelf.id);
            }));

            it('should update a valid shelf without userId', inject(function(ShelfService) {
                // Set PUT response
                $httpBackend.expectPUT(/api\/shelf\/([0-9]{5})$/).respond(mockShelf);

                // Run controller functionality
                scope.save(true);
                $httpBackend.flush();

                // Test URL location to new object
                //expect($location.path()).toBe('/forbidden');
                expect($location.path()).toBe('/shelf/' + mockShelf.id);
            }));

            it('should set scope.error to error response message', inject(function(ShelfService) {
                var errorMessage = 'error';
                $httpBackend.expectPUT(/api\/shelf\/([0-9]{5})$/).respond(400, {
                    message: errorMessage
                });

                scope.save(true);
                $httpBackend.flush();

                expect(scope.error).toBe(errorMessage);
            }));
        });

        describe('scope.remove()', function() {

            beforeEach(function () {
                // Setup shelf
                scope.shelf = mockShelf;
            });

            it('should delete the shelf and redirect to shelf', function () {

                $httpBackend.expectDELETE(/api\/shelf\/([0-9]{5})$/).respond(204);

                scope.remove();
                $httpBackend.flush();

                expect($location.path()).toBe('/shelf');
            });
        });
    });
}());
