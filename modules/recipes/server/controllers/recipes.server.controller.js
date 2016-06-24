'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    async = require('async'),
    cloudinary = require('cloudinary'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    db = require(path.resolve('./config/lib/sequelize')).models,
        Recipe = db.recipe,
        Ingridient = db.ingridient
    ;

/**
 * Create a recipe
 */
exports.create = function(req, res) {
    var image='';
    req.body.userId = req.user.id;
    async.forEach(req.body.steps, function (item,callback){
        if (item.image) {
            cloudinary.uploader.upload(req.body.image).then(function(result){
                item.image=result.public_id+'.'+result.format;
                callback();
            });
        } else {
            callback();
        }
    });
    if (req.body.image){
        image = req.body.image;
        req.body.image='';            
    }
    Recipe.create(req.body).then(function(recipe) {
        if (!recipe) {
            return res.send('users/signup', {
                errors: 'Could not create the recipe'
            });
        } else {
            async.forEach(req.body.ingridients, function (item,callback){
                Ingridient.findById(item.id).then(function(ingridient) {
                    recipe.addIngridient(ingridient, {
                        index:item.index,
                        measureId: item.measure.id,
                        amount: item.amount,
                        measureCaption: item.measure.caption
                    });
                    callback();
                });
            });
            if(image!=='') {
                cloudinary.uploader.upload(image).then(function(result) {
                    image=result.public_id+'.'+result.format;
                    recipe.update(
                        {
                            image: image
                        }
                    ).then(function() {
                        return res.json(recipe);
                    });
                });
            } else {
                return res.json(recipe);
            }   
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
    Recipe.findById(req.body.id).then(function(recipe) {
        if (recipe) {
            recipe.update(req.body).then(function() {
                recipe.setIngridients([]).then(function (tasks){
                    async.forEach(req.body.ingridients, function (item,callback){
                        Ingridient.findById(item.id).then(function(ingridient) {
                            recipe.addIngridient(ingridient, {
                                index: item.index,
                                measureId: item.measure.id,
                                amount: item.amount,
                                measureCaption: item.measure.caption
                            });
                            callback();
                        });
                    });
                    return res.json(recipe);
                }).catch(function(err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                });
            })
            .catch(function(err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            });    
        } else {
            return res.status(400).send({
                message: 'Unable to find the recipe'
            });    
        }
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
        return null;
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
    var getNonPrivateAndOwned = {
        $or: [
            {
                isPrivate: false
            }, {
                userId: req.user.id
            }
        ]
    };
    if (req.user.roles.indexOf('admin')!==-1) {
        getNonPrivateAndOwned = {};
    }
    Recipe.findAll(
        {
            where: getNonPrivateAndOwned,
            include: [db.user, db.ingridient]
        }
    ).then(function(recipes) {
        if (!recipes) {
            return res.status(404).send({
                message: 'No recipes found'
            });
        } else {
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
    Recipe.findOne(
        {
            where: {
                id: id
            },
            include: [db.user, db.ingridient]
        }
    ).then(function(recipe) {
        if (!recipe) {
            return res.status(404).send({
                message: 'No recipe with that identifier has been found'
            });
        } else {
            if (
                req.user.roles.indexOf('admin')!==-1 || 
                (recipe.isPrivate && recipe.user.id===req.user.id)
            ) {
                req.recipe = recipe;
                next();
                return null; 
            } else {
                return res.status(403).send({
                    message: 'This recipe is set as private by its owner'
                });    
            }
            
        }
    }).catch(function(err) {
        return next(err);
    });
};