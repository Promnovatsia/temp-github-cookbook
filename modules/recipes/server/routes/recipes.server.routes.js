'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  recipesPolicy = require('../policies/recipes.server.policy'),
  recipes = require(path.resolve('./modules/recipes/server/controllers/recipes.server.controller'));


module.exports = function(app) {

  // recipes collection routes
  app.route('/api/recipes')
    .all(recipesPolicy.isAllowed)
    .get(recipes.list)
    .post(recipes.create);

  // Single recipe routes
  app.route('/api/recipes/:recipeId')
    .all(recipesPolicy.isAllowed)
    .get(recipes.read)
    .put(recipes.update)
    .delete(recipes.delete);
    
    app.route('/api/ingridients')
        .all(recipesPolicy.isAllowed)
        .get(recipes.ingridientList);
    
    app.route('/api/ingridients/:ingridientId')
        .all(recipesPolicy.isAllowed)
        .get(recipes.ingridientRead);

  // Finish by binding the recipe middleware
  app.param('recipeId', recipes.recipeByID);
    app.param('ingridientId', recipes.ingridientByID);

};