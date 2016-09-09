'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    async = require('async'),
    cloudinary = require('cloudinary'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    db = require(path.resolve('./config/lib/sequelize')).models,
    Ingredient = db.ingredient;


exports.create = function (req, res) {

    req.body.userId = req.user.id;
    
    var image = '';
    if (req.body.image) {
        image = req.body.image;
        req.body.image = '';
    }
    
    Ingredient.create(req.body).then(function (ingredient) {
        if (!ingredient) {
            return res.send('users/signup', {
                errors: 'Could not create the ingredient'
            });
        } else {
            if (image !== '') {
                cloudinary.uploader.upload(image).then(function (result) {
                    image = result.public_id + '.' + result.format;
                    ingredient.update(
                        {
                            image: image
                        }
                    ).then(function () {
                        return res.json(ingredient);
                    });
                });
            } else {
                return res.json(ingredient);
            }
        }
    }).catch(function (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};

exports.read = function (req, res) {
    res.json(req.ingredient);
};

exports.update = function (req, res) {
    
    Ingredient.findById(req.body.id).then(function (ingredient) {
        if (ingredient) {
            var image = '';
            if (req.body.image) {
                cloudinary.uploader.upload(req.body.image).then(function (result) {
                    image = result.public_id + '.' + result.format;
                    ingredient.update(
                        {
                            caption: req.body.caption,
                            infoCard: req.body.infoCard,
                            image: image,
                            measureDefault: req.body.measureDefault
                        }
                    ).then(function () {
                        return res.json(ingredient);
                    }).catch(function (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    });
                });
            } else {
                ingredient.update(
                    {
                        caption: req.body.caption,
                        infoCard: req.body.infoCard,
                        image: null,
                        measureDefault: req.body.measureDefault
                    }
                ).then(function () {
                    return res.json(ingredient);
                }).catch(function (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                });
            }
        } else {
            return res.status(400).send({
                message: 'Unable to find the ingredient'
            });
        }
    }).catch(function (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};

exports.delete = function (req, res) {
    
    var ingredient = req.ingredient;
    Ingredient.findById(ingredient.id).then(function (ingredient) {
        if (ingredient) {
            ingredient.destroy().then(function () {
                return res.json(ingredient);
            }).catch(function (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            });
        } else {
            return res.status(400).send({
                message: 'Unable to find the ingredient'
            });
        }
    }).catch(function (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};

/**
 * List of ingredients
 */
exports.list = function (req, res) {
    Ingredient.findAll(
        {}
    ).then(function (ingredients) {
        if (!ingredients) {
            return res.status(404).send({
                message: 'No ingredients found'
            });
        } else {
            return res.json(ingredients);
        }
    }).catch(function (err) {
        res.jsonp(err);
    });
};

exports.ingredientByID = function (req, res, next, id) {

    if ((id % 1 === 0) === false) { //check if it's integer
        return res.status(404).send({
            message: 'Ingredient is invalid'
        });
    }
  
    Ingredient.findOne(
        {
            where: {
                id: id
            }
        }
    ).then(function (ingredient) {
        if (!ingredient) {
            return res.status(404).send({
                message: 'No ingredient with that identifier has been found'
            });
        } else {
            req.ingredient = ingredient;
            next();
            return null;
        }
    }).catch(function (err) {
        return next(err);
    });
};