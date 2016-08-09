'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    recipesPolicy = require('../policies/recipes.server.policy'),
    recipes = require(path.resolve('./modules/recipes/server/controllers/recipes.server.controller')),
    ingridients = require(path.resolve('./modules/recipes/server/controllers/ingridients.server.controller')),
    measures = require(path.resolve('./modules/recipes/server/controllers/measures.server.controller')),
    products = require(path.resolve('./modules/recipes/server/controllers/products.server.controller')),
    menus = require(path.resolve('./modules/recipes/server/controllers/menus.server.controller')),
    shelf = require(path.resolve('./modules/recipes/server/controllers/shelf.server.controller')),
    shelfQuery = require(path.resolve('./modules/recipes/server/controllers/shelfQuery.server.controller'));

module.exports = function(app) {

    // recipes collection routes
    app.route('/api/recipes')
        .all(recipesPolicy.isAllowed)
        .get(recipes.list)
        .post(recipes.create)
    ;

    // Single recipe routes
    app.route('/api/recipes/:recipeId')
        .all(recipesPolicy.isAllowed)
        .get(recipes.read)
        .put(recipes.update)
        .delete(recipes.delete)
    ;
    
    app.route('/api/ingridients')
        .all(recipesPolicy.isAllowed)
        .get(ingridients.list)
        .post(ingridients.create)
    ;
    
    app.route('/api/ingridients/:ingridientId')
        .all(recipesPolicy.isAllowed)
        .get(ingridients.read)
        .put(ingridients.update)
        .delete(ingridients.delete)
    ;
    
    app.route('/api/measures')
        .all(recipesPolicy.isAllowed)
        .get(measures.list)
        .post(measures.create)
    ;
    
    app.route('/api/measures/:measureId')
        .all(recipesPolicy.isAllowed)
        .get(measures.read)
        .put(measures.update)
    ;
    
    app.route('/api/products')
        .all(recipesPolicy.isAllowed)
        .get(products.list)
        .post(products.create)
    ;
    
    app.route('/api/products/:productId')
        .all(recipesPolicy.isAllowed)
        .get(products.read)
        .put(products.update)
    ;
    
    app.route('/api/menu')
        .all(recipesPolicy.isAllowed)
        .get(menus.list)
    ;
    app.route('/api/menu/:menuId')
        .all(recipesPolicy.isAllowed)
        .get(menus.create) //FIXME post
    ;
    //FUTURE доступ к меню по неделям /api/menu/week/:weekId
    
    app.route('/api/shelf')
        .all(recipesPolicy.isAllowed)
        .get(shelf.list)
        .post(shelf.create)
    ;
    app.route('/api/shelf/:shelfId')
        .all(recipesPolicy.isAllowed)
        .get(shelf.read)
        .put(shelf.update)
    ;
    app.route('/api/shelf/:shelfId/query')
        .all(recipesPolicy.isAllowed)
        .get(shelfQuery.list)
        .post(shelfQuery.create)
    ;
    app.route('/api/shelf/:shelfId/query/:queryId')
        .all(recipesPolicy.isAllowed)
        .get(shelfQuery.read)
        .put(shelfQuery.update)
    ;

    // Finish by binding the recipe middleware
    app.param('recipeId', recipes.recipeByID);
    app.param('ingridientId', ingridients.ingridientByID);
    app.param('measureId', measures.measureByID);
    app.param('productId', products.productByID);
    app.param('menuId', menus.menuByID);
    app.param('shelfId', shelf.shelfByID);
    app.param('queryId', shelfQuery.queryByID);
};