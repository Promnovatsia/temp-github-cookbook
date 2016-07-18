'use strict';

// Setting up route
angular
    .module('recipes')
    .config(routeConfig);

routeConfig.$inject = ['$stateProvider'];

function routeConfig($stateProvider) {
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

        .state('ingridients', {
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
        .state('measures.create', {
            url: '/create',
            templateUrl: 'modules/recipes/client/views/measures/measure-create.client.view.html',
            data: {
                roles: ['admin']
            }
        })
        .state('measures.edit', {
            url: '/:measureId',
            templateUrl: 'modules/recipes/client/views/measures/measure-edit.client.view.html',
            data: {
                roles: ['admin']
            }
        })

        .state('products', {
            abstract: true,
            url: '/products',
            template: '<ui-view/>'
        })
        .state('products.list', {
            url: '',
            templateUrl: 'modules/recipes/client/views/products/products-list.client.view.html',
            data: {
                roles: ['admin']
            }
        })
        .state('products.create', {
            url: '/create',
            templateUrl: 'modules/recipes/client/views/products/product-create.client.view.html',
            data: {
                roles: ['admin']
            }
        })
        .state('products.edit', {
            url: '/:productId',
            templateUrl: 'modules/recipes/client/views/products/product-edit.client.view.html',
            data: {
                roles: ['admin']
            }
        })

        .state('menu', {
            abstract: true,
            url: '/menu',
            template: '<ui-view/>'
        })
        .state('menu.list', {
            url: '',
            templateUrl: 'modules/recipes/client/views/menus/menus-list.client.view.html',
            data: {
                roles: ['admin']
            }
        })
        .state('menu.create', {
            url: '/create',
            templateUrl: 'modules/recipes/client/views/products/product-create.client.view.html',
            data: {
                roles: ['admin']
            }
        })
        .state('menu.edit', {
            url: '/:productId',
            templateUrl: 'modules/recipes/client/views/products/product-edit.client.view.html',
            data: {
                roles: ['admin']
            }
        })

        .state('shelf', {
            abstract: true,
            url: '/shelf',
            template: '<ui-view/>'
        })
        .state('shelf.list', {
            url: '',
            templateUrl: 'modules/recipes/client/views/shelf/shelf-list.client.view.html',
            data: {
                pageTitle: 'Shelf List'
            }
        })
        .state('shelf.create', {
            url: '/create',
            templateUrl: 'modules/recipes/client/views/shelf/shelf-form.client.view.html',
            data: {
                roles: ['user', 'admin']
            }
        })
        .state('shelf.edit', {
            url: '/:shelfId/edit',
            templateUrl: 'modules/recipes/client/views/shelf/shelf-form.client.view.html',
            data: {
                roles: ['user', 'admin']
            }
        })
        .state('shelf.view', {
            url: '/:shelfId',
            templateUrl: 'modules/recipes/client/views/shelf/shelf-form.client.view.html',
            data: {
                roles: ['user', 'admin']
            }
        });
}