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
                templateUrl: 'modules/recipes/client/views/recipes/recipes-list.client.view.html'
            })
            .state('recipes.create', {
                url: '/create',
                templateUrl: 'modules/recipes/client/views/recipes/recipe-create.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('recipes.view', {
                url: '/:recipeId',
                templateUrl: 'modules/recipes/client/views/recipes/recipe-read.client.view.html'
            })
            .state('recipes.edit', {
                url: '/:recipeId/edit',
                templateUrl: 'modules/recipes/client/views/recipes/recipe-edit.client.view.html',
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
                templateUrl: 'modules/recipes/client/views/ingridients/ingridients-list.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('ingridients.create', {
                url: '/create',
                templateUrl: 'modules/recipes/client/views/ingridients/ingridient-create.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('ingridients.view', {
                url: '/:ingridientId',
                templateUrl: 'modules/recipes/client/views/ingridients/ingridient-read.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('ingridients.edit', {
                url: '/:ingridientId/edit',
                templateUrl: 'modules/recipes/client/views/ingridients/ingridient-edit.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })
        .state('measures', {
            abstract: true,
            url: '/measures',
            template: '<ui-view/>'
        })
            .state('measures.list', {
                url: '',
                templateUrl: 'modules/recipes/client/views/measures/measures-list.client.view.html',
                data: {
                    roles: ['admin']
                } 
        })
            .state('measures.create',{
                url: '/create',
                templateUrl: 'modules/recipes/client/views/measures/measure-create.client.view.html',
                data: {
                    roles: ['admin']
                } 
            })
            .state('measures.edit',{
                url: '/:measureId',
                templateUrl: 'modules/recipes/client/views/measures/measure-edit.client.view.html',
                data: {
                    roles: ['admin']
                } 
            })
        ;
    }
]);