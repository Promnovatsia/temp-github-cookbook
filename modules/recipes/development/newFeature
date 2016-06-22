client
    /config/
        +recipe.client.config.js
        
            Menus.addMenuItem('topbar', {
                title: 'Menu',
                state: 'menu',
                type: 'dropdown',
                roles: ['user']
            });
                Menus.addSubMenuItem('topbar', 'menu', {
                    title: 'Brouse Menu',
                    state: 'menu.list',
                    roles: ['user']
                });
                
        +recipe.client.routes.js
        
            .state('menu', {
                abstract: true,
                url: '/menu',
                template: '<ui-view/>'
            })
            .state('menu.list', {
                url: '',
                templateUrl: 'modules/recipes/client/views/menus/menus-list.client.view.html', ...
                
    /views/menus/
        ?menus-list.client.view.html
        
            <section ng-controller="MenusController" ...
        
    /controllers/
        ?menus.client.controller.js
        
            angular.module('recipes').controller('MenusController', 
                ['$scope', '$stateParams', '$location', 'Authentication', 'Menu', ... 
                
    /services/
        ?menus.client.service.js
        
            angular.module('recipes').factory('Menu', ['$resource',
                function($resource) {
                    return $resource('api/menus/:menuId', { ...
                    
server
    /routes/
        +recipes.server.routes.js
        
            menus = require(path.resolve('./modules/recipes/server/controllers/menus.server.controller')) ...
            
    /controllers/
        ?menus.server.controller.js
            
            exports.list = function(req, res) {
                Menu.findAll( ...
            
            exports.menuByID = function(req, res, next, id) {
            ...
    
    /routes/
        +recipes.server.routes.js
            
            app.route('/api/menu')
                .all(recipesPolicy.isAllowed)
                .get(menu.list)
            ;
            
    /policies/
        +recipes.server.policy.js
        
            {
                resources: '/api/menu',
                permissions: '*'
            }, {
                resources: '/api/menu/:menuId',
                permissions: '*'
            }
            
        
            
    