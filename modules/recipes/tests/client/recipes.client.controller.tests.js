'use strict';

(function() {
  // Recipes Controller Spec
  describe('Recipes Controller Tests', function() {
    // Initialize global variables
    var RecipesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Recipes,
      mockRecipe;

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
    beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Recipes_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Recipes = _Recipes_;

      // create mock recipe
      mockRecipe = new Recipes({
        id: '525a8422f6d0f87f0e407a33',
        title: 'An Recipe about SEANJS',
        content: 'SEANJS rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Recipes controller.
      RecipesController = $controller('RecipesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one recipe object fetched from XHR', inject(function(Recipes) {
      // Create a sample recipes array that includes the new recipe
      var sampleRecipes = [mockRecipe];

      // Set GET response
      $httpBackend.expectGET('api/recipes').respond(sampleRecipes);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.recipes).toEqualData(sampleRecipes);
    }));

    it('$scope.findOne() should create an array with one recipe object fetched from XHR using a recipeId URL parameter', inject(function(Recipes) {
      // Set the URL parameter
      $stateParams.recipeId = mockRecipe.id;

      // Set GET response
      $httpBackend.expectGET(/api\/recipes\/([0-9a-fA-F]{24})$/).respond(mockRecipe);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.recipe).toEqualData(mockRecipe);
    }));

    describe('$scope.create()', function() {
      var sampleRecipePostData;

      beforeEach(function() {
        // Create a sample recipe object
        sampleRecipePostData = new Recipes({
          title: 'An Recipe about SEANJS',
          content: 'SEANJS rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Recipe about SEANJS';
        scope.content = 'SEANJS rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function(Recipes) {
        // Set POST response
        $httpBackend.expectPOST('api/recipes', sampleRecipePostData).respond(mockRecipe);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the recipe was created
        expect($location.path.calls.mostRecent().args[0]).toBe('recipes/' + mockRecipe.id);
      }));

      it('should set scope.error if save error', function() {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/recipes', sampleRecipePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function() {
      beforeEach(function() {
        // Mock recipe in scope
        scope.recipe = mockRecipe;
      });

      it('should update a valid recipe', inject(function(Recipes) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/recipes\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/recipes/' + mockRecipe.id);
      }));

      it('should set scope.error to error response message', inject(function(Recipes) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/recipes\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(recipe)', function() {
      beforeEach(function() {
        // Create new recipes array and include the recipe
        scope.recipes = [mockRecipe, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/recipes\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockRecipe);
      });

      it('should send a DELETE request with a valid recipeId and remove the recipe from the scope', inject(function(Recipes) {
        expect(scope.recipes.length).toBe(2); //Because of the empty object - must be 1
      }));
    });

    describe('scope.remove()', function() {
      beforeEach(function() {
        spyOn($location, 'path');
        scope.recipe = mockRecipe;

        $httpBackend.expectDELETE(/api\/recipes\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to recipes', function() {
        expect($location.path).toHaveBeenCalledWith('recipes');
      });
    });
  });
}());