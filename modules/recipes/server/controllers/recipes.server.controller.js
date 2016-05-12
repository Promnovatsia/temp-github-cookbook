'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Recipe = db.recipe,
  Step = db.step;

/**
 * Create a recipe
 */
exports.create = function(req, res) {

    req.body.userId = req.user.id;
    Recipe.create(req.body).then(function(recipe) {
        if (!recipe) {
            return res.send('users/signup', {
                errors: 'Could not create the recipe'
            });
        } else {
            Step.create({ 
                action: req.body.action,
                device: req.body.device,
                duration: req.body.duration
            })
            .then(function(step){
                if (!step) {
                    return res.send('users/signup', {
                        errors: 'Could not create the step of recipe'
                    });    
                } else {
                    step.setRecipe(recipe)
                    .then(function(step){
                        return res.jsonp(step);
                    });
                }
            });
            res.jsonp(recipe);
        }
    })
    .catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });       
};

/**
 * Show the current recipe
 */
exports.read = function(req, res) {
  res.json(req.recipe);
};

/**
 * Update a recipe
 */
exports.update = function(req, res) {
    var recipe = req.recipe;
    recipe.updateAttributes({
        title: req.body.title,
        content: req.body.content 
    })
    .then(function(recipe) {
        return res.json(recipe);
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};    

/**
 * Delete an recipe
 */
exports.delete = function(req, res) {
  var recipe = req.recipe;

  // Find the recipe
  Recipe.findById(recipe.id).then(function(recipe) {
    if (recipe) {
      // Delete the recipe
      recipe.destroy().then(function() {
        return res.json(recipe);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the recipe'
      });
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * List of recipes
 */
exports.list = function(req, res) {
  Recipe.findAll({
      //model: ,
    include: [db.user, db.step, db.ingridient]
  }).then(function(recipes) {
    if (!recipes) {
      return res.status(404).send({
        message: 'No recipes found'
      });
    } else {
      res.json(recipes);
    }
  }).catch(function(err) {
    res.jsonp(err);
  });
};

/**
 * recipe middleware
 */
exports.recipeByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'Recipe is invalid'
    });
  }

  Recipe.find({
    where: {
      id: id
    },
      include: [
          {model: db.user},
          {model: db.step},
          {model: db.ingridient}
      ]    
  }).then(function(recipe) {
    if (!recipe) {
      return res.status(404).send({
        message: 'No recipe with that identifier has been found'
      });
    } else {
      req.recipe = recipe;
        //console.log(recipe.steps);
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};