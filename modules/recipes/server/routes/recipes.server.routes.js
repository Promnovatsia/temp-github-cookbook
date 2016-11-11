'use strict';

/**
 * Module dependencies.
 */
var recipesPolicy = require('../policies/recipes.server.policy'),
    recipes = require('../controllers/recipes.server.controller'),
    ingredients = require('../controllers/ingredients.server.controller'),
    measures = require('../controllers/measures.server.controller'),
    products = require('../controllers/products.server.controller'),
    menus = require('../controllers/menus.server.controller'),
    shelf = require('../controllers/shelf.server.controller'),
    request = require('../controllers/request.server.controller.js'),
    shelfQuery = require('../controllers/shelfQuery.server.controller');

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
    
    app.route('/api/ingredients')
        .all(recipesPolicy.isAllowed)
        .get(ingredients.list)
        .post(ingredients.create)
    ;
    
    app.route('/api/ingredients/:ingredientId')
        .all(recipesPolicy.isAllowed)
        .get(ingredients.read)
        .put(ingredients.update)
        .delete(ingredients.delete)
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
        .post(menus.create)
    ;
    app.route('/api/menu/:menuId')
        .all(recipesPolicy.isAllowed)
        .get(menus.read)
        .put(menus.update)
    ;
    /*app.route('/api/menu/:menuId/queries') //TODO deprecate
        .all(recipesPolicy.isAllowed)
        .get(shelfQuery.queryByMenu)
    ;
    */
    app.route('/api/menu/:menuId/requests')
        .all(recipesPolicy.isAllowed)
        .get(request.requestByMenu)
    ;
    
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
    app.route('/api/shelf/:shelfId/requests')
        .all(recipesPolicy.isAllowed)
        .get(request.requestByShelf)
        //.post(request.create) //TODO create request for shelf
    ;
    /*app.route('/api/shelf/:shelfId/query') //TODO deprecate
        .all(recipesPolicy.isAllowed)
        .get(shelfQuery.list)
        .post(shelfQuery.create)
    ;
    app.route('/api/shelf/:shelfId/query/:queryId') //TODO deprecate
        .all(recipesPolicy.isAllowed)
        .get(shelfQuery.read)
        .put(shelfQuery.update)
    ;*/

    app.route('/api/request')
        .all(recipesPolicy.isAllowed)
        .get(request.list)
        .post(request.create)
    ;
    app.route('/api/request/:requestId')
        .all(recipesPolicy.isAllowed)
        .get(request.read)
        .put(request.update)
    ;
    
    // Finish by binding the recipe middleware
    app.param('recipeId', recipes.recipeByID);
    //app.param('recipeSearchTitle', recipes.recipeSearchByTitle);
    app.param('ingredientId', ingredients.ingredientByID);
    app.param('measureId', measures.measureByID);
    app.param('productId', products.productByID);
    app.param('menuId', menus.menuByID);
    app.param('shelfId', shelf.shelfByID);
    //app.param('queryId', shelfQuery.queryByID); //TODO deprecate
    app.param('requestId', request.requestByID);
};
