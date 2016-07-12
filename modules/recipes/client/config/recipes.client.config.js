'use strict';

// Configuring the Recipes module
angular
    .module('recipes')
    .run(['Menus', function (Menus) {
        
        Menus.addMenuItem('topbar', {
            title: 'Recipes',
            state: 'recipes',
            type: 'dropdown',
            roles: ['*']
        });
        Menus.addSubMenuItem('topbar', 'recipes', {
            title: 'List Recipes',
            state: 'recipes.list'
        });
        /*Menus.addSubMenuItem('topbar', 'recipes', {
            title: 'Create Recipes',
            state: 'recipes.create',
            roles: ['user']
        }); */
        
        Menus.addMenuItem('topbar', {
            title: 'Ingridients',
            state: 'ingridients',
            type: 'dropdown',
            roles: ['user']
        });
        Menus.addSubMenuItem('topbar', 'ingridients', {
            title: 'List Ingridients',
            state: 'ingridients.list',
            roles: ['user']
        });
        Menus.addSubMenuItem('topbar', 'ingridients', {
            title: 'Create Ingridient',
            state: 'ingridients.create',
            roles: ['user']
        });
        
        Menus.addMenuItem('topbar', {
            title: 'Shelf',
            state: 'shelf',
            type: 'dropdown',
            roles: ['user']
        });
        Menus.addSubMenuItem('topbar', 'shelf', {
            title: 'Brouse Shelf',
            state: 'shelf.list',
            roles: ['user']
        });
        
        Menus.addMenuItem('topbar', {
            title: 'Menus',
            state: 'menu',
            type: 'dropdown',
            roles: ['user']
        });
        Menus.addSubMenuItem('topbar', 'menu', {
            title: 'Brouse Menu',
            state: 'menu.list',
            roles: ['user']
        });
        
        //admin management
        Menus.addSubMenuItem('topbar', 'admin', {
            title: 'Manage Measures',
            state: 'measures.list',
            roles: ['admin']
        });
        Menus.addSubMenuItem('topbar', 'admin', {
            title: 'Manage Products',
            state: 'products.list',
            roles: ['admin']
        });
    }]);