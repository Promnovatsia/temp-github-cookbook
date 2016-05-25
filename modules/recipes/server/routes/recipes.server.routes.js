'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    recipesPolicy = require('../policies/recipes.server.policy'),
    recipes = require(path.resolve('./modules/recipes/server/controllers/recipes.server.controller')),
    ingridients = require(path.resolve('./modules/recipes/server/controllers/ingridients.server.controller')),
    measures = require(path.resolve('./modules/recipes/server/controllers/measures.server.controller'))
;

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
    ;
    
    app.route('/api/measures/:measureId')
        .all(recipesPolicy.isAllowed)
        .get(measures.read)
    ;

    // Finish by binding the recipe middleware
    app.param('recipeId', recipes.recipeByID);
    app.param('ingridientId', ingridients.ingridientByID);
    app.param('measureId', measures.measureByID);

};