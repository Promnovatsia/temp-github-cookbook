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
    Ingredient = db.ingredient,
    Measure = db.measure;

/**
 * Create a recipe
 */
exports.create = function (req, res) {
    var image = '';
    req.body.userId = req.user.id;
    async.forEach(req.body.steps, function (item, callback) {
        if (item.image) {
            cloudinary.uploader.upload(req.body.image).then(function (result) {
                item.image = result.public_id + '.' + result.format;
                callback();
            });
        } else {
            callback();
        }
    });
    if (req.body.image) {
        image = req.body.image;
        req.body.image = '';
    }
    Recipe.create(req.body).then(function (recipe) {
        if (!recipe) {
            return res.send('users/signup', {
                errors: 'Could not create the recipe'
            });
        } else {
            async.forEach(req.body.ingredients, function (item, callback) {
                Ingredient.findById(item.id).then(function (ingredient) {
                    if (ingredient) {
                        recipe.addIngredient(ingredient, {
                            index: item.index,
                            measureId: item.measure.id,
                            amount: item.amount,
                            measureCaption: item.measure.caption,
                            comment: item.comment
                        });
                        callback();
                    } else {
                        callback();
                    }
                });
            });
            if (image !== '') {
                cloudinary.uploader.upload(image).then(function (result) {
                    image = result.public_id + '.' + result.format;
                    recipe.update(
                        {
                            image: image
                        }
                    ).then(function () {
                        return res.json(recipe);
                    });
                });
            } else {
                return res.json(recipe);
            }
        }
    }).catch(function (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};

/**
 * Show the current recipe
 */
exports.read = function (req, res) {
    res.json(req.recipe);
};

/**
 * Update a recipe
 */
exports.update = function (req, res) {
                 
    var image = '';
    if (req.body.image) {
        image = req.body.image;
        req.body.image = '';
    }
    
    Recipe.findById(req.body.id).then(function (recipe) {
        if (recipe) {
            return recipe.update(req.body); 
        } else {
            return res.status(400).send({
                message: 'Unable to find the recipe'
            });
        }
    }).then(function (recipe) {
        return recipe.setIngredients([]).then(function (tasks) {
            async.forEach(req.body.ingredients, function (item, callback) {
                Ingredient.findById(item.id).then(function (ingredient) {
                    if (ingredient) {
                        recipe.addIngredient(ingredient, {
                            index: item.index,
                            measureId: item.measure.id,
                            amount: item.amount,
                            measureCaption: item.measure.caption,
                            comment: item.comment
                        });
                        callback();
                    } else {
                        callback();
                    }
                });
            });
            return recipe;
        });
    }).then(function (recipe) {
        if (image !== '') {
            cloudinary.uploader.upload(image).then(function (result) {
                image = result.public_id + '.' + result.format;
                recipe.update(
                    {
                        image: image
                    }
                ).then(function (recipe) {
                    return res.json(recipe);
                });
            });
        } else {
            return res.json(recipe);
        }
    }).catch(function (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};

/**
 * Delete an recipe
 */
exports.delete = function (req, res) {
    var recipe = req.recipe;
    // Find the recipe
    Recipe.findById(recipe.id).then(function (recipe) {
        if (recipe) {
            // Delete the recipe
            recipe.destroy().then(function () {
                return res.json(recipe);
            }).catch(function (err) {
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
    }).catch(function (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};

/**
 * List of recipes
 */
exports.list = function (req, res) {
    var getNonPrivateAndOwned = '';
    if (req.user) {
        getNonPrivateAndOwned = {
            $or: [
                {
                    isPrivate: false
                }, {
                    userId: req.user.id
                }
            ]
        };
        if (req.user.roles.indexOf('admin') !== -1) {
            getNonPrivateAndOwned = {};
        }
    } else {
        getNonPrivateAndOwned = {
            isPrivate: false
        };
    }
    Recipe.findAll(
        {
            where: getNonPrivateAndOwned,
            include: [
                {model: db.user, attributes: ['id', 'username']},
                {model: db.ingredient, include: []}
            ]
        }
    ).then(function (recipes) {
        if (!recipes) {
            return res.status(404).send({
                message: 'No recipes found'
            });
        } else {
            return res.json(recipes);
        }
    }).catch(function (err) {
        res.jsonp(err);
    });
};

/**
 * recipe middleware
 */
exports.recipeByID = function (req, res, next, id) {
    
    if ((id % 1 === 0) === false) { //check if it's integer
        return res.status(404).send({
            message: 'Recipe is invalid'
        });
    }
    var getNonPrivateAndOwned = '';
    if (req.user) {
        getNonPrivateAndOwned = {
            id: id,
            $or: [
                {
                    isPrivate: false
                }, {
                    userId: req.user.id
                }
            ]
        };
        if (req.user.roles.indexOf('admin') !== -1) {
            getNonPrivateAndOwned = {
                id: id
            };
        }
    } else {
        getNonPrivateAndOwned = {
            id: id,
            isPrivate: false
        };
    }
    Recipe.findOne(
        {
            where: getNonPrivateAndOwned,
            include: [
                {
                    model: db.user,
                    attributes: ['id', 'username']
                }, {
                    model: Ingredient
                }
            ]
        }
    ).then(function (recipe) {
        if (!recipe) {
            return res.status(404).send({
                message: 'No recipe with that identifier has been found'
            });
        } else {
            if (recipe.user) {
                recipe.author = recipe.user.displayname;
            }
            req.recipe = recipe;
            next();
            return null;
        }
    }).catch(function (err) {
        return next(err);
    });
};