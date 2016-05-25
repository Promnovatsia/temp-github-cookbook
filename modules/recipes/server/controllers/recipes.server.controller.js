'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    async = require('async'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    db = require(path.resolve('./config/lib/sequelize')).models,
        Recipe = db.recipe,
        Step = db.step,
        Ingridient = db.ingridient
    ;

/**
 * Create a recipe
 */
exports.create = function(req, res) {
    req.body.userId = req.user.id;
    console.log(req.body);
    Recipe.create(req.body).then(function(recipe) {
        if (!recipe) {
            return res.send('users/signup', {
                errors: 'Could not create the recipe'
            });
        } else {
            //async.forEach(req.body.ingridients, function (item,callback){
            //    recipe.addIngridient()
            //}
            /*async.forEach(req.body.ingridients, function (item,callback){
                Ingridient.create({
                    'index': item.index,
                    caption: item.caption,
                    amount: item.amount
                })
                .then(function(ingridient){
                    if (!ingridient) {
                        return res.send('users/signup', {
                            errors: 'Could not create the ingridient of recipe'
                        });    
                    } else {
                        ingridient.setRecipe(recipe)
                        .then(function(){
                            callback();
                        });
                    }
                });
            });*/
            return res.jsonp(recipe);
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
    Recipe.destroy(
        { where : {id:req.recipe.id}}
    )
    .then(exports.create(req,res))
    .catch(function(err) {
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
        include: [db.user, db.ingridient]
    }).then(function(recipes) {
        if (!recipes) {
            return res.status(404).send({
                message: 'No recipes found'
            });
        } else {
            console.log(recipes);
            return res.json(recipes);
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
    Recipe.findOne({
        where: {
            id: id
        },
        include: [db.ingridient]
    }).then(function(recipe) {
        if (!recipe) {
            return res.status(404).send({
                message: 'No recipe with that identifier has been found'
            });
        } else {
            console.log(recipe);
            req.recipe = recipe;
            next();
            return null;
        }
    }).catch(function(err) {
        return next(err);
    });
};