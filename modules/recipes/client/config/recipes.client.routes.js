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
            templateUrl: 'modules/recipes/client/views/recipes/recipe-form.client.view.html',
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
            templateUrl: 'modules/recipes/client/views/recipes/recipe-form.client.view.html',
            data: {
                roles: ['user', 'admin']
            }
        })

        .state('ingredients', {
            abstract: true,
            url: '/ingredients',
            template: '<ui-view/>'
        })
        .state('ingredients.list', {
            url: '',
            templateUrl: 'modules/recipes/client/views/ingredients/ingredients-list.client.view.html',
            data: {
                roles: ['user', 'admin']
            }
        })
        .state('ingredients.create', {
            url: '/create',
            templateUrl: 'modules/recipes/client/views/ingredients/ingredient-form.client.view.html',
            data: {
                roles: ['user', 'admin']
            }
        })
        .state('ingredients.view', {
            url: '/:ingredientId',
            templateUrl: 'modules/recipes/client/views/ingredients/ingredient-read.client.view.html',
            data: {
                roles: ['user', 'admin']
            }
        })
        .state('ingredients.edit', {
            url: '/:ingredientId/edit',
            templateUrl: 'modules/recipes/client/views/ingredients/ingredient-form.client.view.html',
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
            templateUrl: 'modules/recipes/client/views/measures/measure-form.client.view.html',
            data: {
                roles: ['admin']
            }
        })
        .state('measures.edit', {
            url: '/:measureId',
            templateUrl: 'modules/recipes/client/views/measures/measure-form.client.view.html',
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
            templateUrl: 'modules/recipes/client/views/menus/menu-init.client.view.html',
            data: {
                roles: ['admin']
            }
        })
        .state('menu.init', {
            url: '/:menuId/init',
            templateUrl: 'modules/recipes/client/views/menus/menu-init.client.view.html',
            data: {
                roles: ['admin']
            }
        })
        .state('menu.meals', {
            url: '/:menuId/meals',
            templateUrl: 'modules/recipes/client/views/menus/menu-meals.client.view.html',
            data: {
                roles: ['admin']
            }
        })
        .state('menu.edit', {
            url: '/:menuId/weekplan',
            templateUrl: 'modules/recipes/client/views/menus/menu-weekplan.client.view.html',
            data: {
                roles: ['admin']
            }
        })
        .state('menu.view', {
            url: '/:menuId',
            templateUrl: 'modules/recipes/client/views/menus/menu-read.client.view.html',
            data: {
                roles: ['admin']
            }
        })
        .state('menu.summary', {
            url: '/:menuId/summary',
            templateUrl: 'modules/recipes/client/views/menus/menu-summary.client.view.html',
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
            params: {
                ingredient: null
            },
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
            templateUrl: 'modules/recipes/client/views/shelf/shelf-read.client.view.html',
            data: {
                roles: ['user', 'admin']
            }
        })
    
        .state('shelf.query', {
            url: '/:shelfId/query',
            templateUrl: 'modules/recipes/client/views/shelf/shelf-queries.client.view.html',
            data: {
                roles: ['user', 'admin']
            }
        })
        .state('shelf.queryEdit', {
            url: '/:shelfId/query/:queryId',
            templateUrl: 'modules/recipes/client/views/shelf/shelf-query-edit.client.view.html',
            data: {
                roles: ['user', 'admin']
            }
        })
    ;
}
