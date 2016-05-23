'use strict';

// Setting up route
angular.module('recipes').config(['$stateProvider',
  function($stateProvider) {
    // Recipes state routing

    $stateProvider
        .state('recipes', {
            abstract: true,
            url: '/recipes',
            template: '<ui-view/>'
        })
            .state('recipes.list', {
                url: '',
                templateUrl: 'modules/recipes/client/views/list-recipes.client.view.html'
            })
            .state('recipes.create', {
                url: '/create',
                templateUrl: 'modules/recipes/client/views/create-recipe.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('recipes.view', {
                url: '/:recipeId',
                templateUrl: 'modules/recipes/client/views/view-recipe.client.view.html'
            })
            .state('recipes.edit', {
                url: '/:recipeId/edit',
                templateUrl: 'modules/recipes/client/views/edit-recipe.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
        })
        .state('ingridients',{
            abstract: true,
            url: '/ingridients',
            template: '<ui-view/>'
        })
            .state('ingridients.list', {
                url: '',
                templateUrl: 'modules/recipes/client/views/list-ingridients.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('ingridients.create', {
                url: '/create',
                templateUrl: 'modules/recipes/client/views/create-ingridient.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('ingridients.edit', {
                url: '/:ingridientId',
                templateUrl: 'modules/recipes/client/views/edit-ingridient.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })
        ;
    }
]);