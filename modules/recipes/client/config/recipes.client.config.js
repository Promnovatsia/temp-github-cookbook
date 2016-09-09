'use strict';

// Configuring the Recipes module
angular
    .module('recipes')
    .run(['Menus', function (Menus) {
        
        Menus.addMenuItem('topbar', {
            title: 'Книга рецептов',
            state: 'recipes.list',
            type: 'button',
            roles: ['*']
        });
       /* Menus.addSubMenuItem('topbar', 'recipes', {
            title: 'List Recipes',
            state: 'recipes.list'
        });*/
        /*Menus.addSubMenuItem('topbar', 'recipes', {
            title: 'Create Recipes',
            state: 'recipes.create',
            roles: ['user']
        }); */
        
        Menus.addMenuItem('topbar', {
            title: 'Ингредиенты',
            state: 'ingredients',
            type: 'dropdown',
            roles: ['user']
        });
        Menus.addSubMenuItem('topbar', 'ingredients', {
            title: 'Справочник',
            state: 'ingredients.list',
            roles: ['user']
        });
        Menus.addSubMenuItem('topbar', 'ingredients', {
            title: 'Добавить ингредиент',
            state: 'ingredients.create',
            roles: ['user']
        });
        
        Menus.addMenuItem('topbar', {
            title: 'Хранилище',
            state: 'shelf',
            type: 'dropdown',
            roles: ['user']
        });
        Menus.addSubMenuItem('topbar', 'shelf', {
            title: 'Полки',
            state: 'shelf.list',
            roles: ['user']
        });
        
        Menus.addMenuItem('topbar', {
            title: 'Меню',
            state: 'menu',
            type: 'dropdown',
            roles: ['user']
        });
        Menus.addSubMenuItem('topbar', 'menu', {
            title: '(В разработке) Текущее меню',
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