'use strict';
/**
 * Module dependencies.
 */
var path = require('path'),
    async = require('async'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    db = require(path.resolve('./config/lib/sequelize')).models,
    Shelf = db.shelf,
    Request = db.request;

exports.create = function (req, res) {

    req.body.userId = req.user.id;

    Shelf.create(req.body).then(function (shelf) {
        if (!shelf) {
            return res.send('users/signup', {
                errors: 'Could not create the shelf'
            });
        } else {
            if (shelf.stored <= 0) {
                return res.json(shelf);
            } else {
                Request.create(
                    {
                        isResolved: true,
                        bought: shelf.stored,
                        buyDate: shelf.updatedAt,
                        comment: 'Autocreated'
                    }
                ).then(function (request) {
                    console.log(request.id,' - Created with shelf ',shelf.id);
                });
                return res.json(shelf);
            }
        }
    }).catch(function (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};

exports.read = function (req, res) {
    res.json(req.shelf);
};

exports.update = function (req, res) {
    
    if (!req.user) {
        return res.status(401).send({
            message: 'Unauthorized. This API route returns user-specific data'
        });
    }
    Shelf.findOne(
        {
            where: { 
                id: req.body.id,
                userId: req.user.id
            }
        }
    ).then(function (shelf) {
        if (shelf) {
            shelf.update(req.body).then(function (shelf) {
                return res.json(shelf);
            }).catch(function (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            });
            return null;
        } else {
            return res.status(400).send({
                message: 'Unable to find the shelf'
            });
        }
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};    

exports.list = function (req, res) {
    
    if (req.query) {
        if (req.query.ingredientId) {
            return exports.shelfByIngredient(req, res, req.query.ingredientId);    
        }
    }
    Shelf.findAll(
        {
            where: {
                userId: req.user.id
            }
        }
    ).then(function(shelves) {
        if (!shelves) {
            return res.status(404).send({
                message: 'No shelves found'
            });
        } else {
            return res.json(shelves);
        }
    }).catch(function(err) {
        res.jsonp(err);
    });
};

exports.shelfByID = function (req, res, next, id) {

    if (!req.user) {
        return res.status(401).send({
            message: 'Unauthorized. This API route returns user-specific data'
        });
    }
    console.log(id);//TODO find why 'requests' goes here as id
    Shelf.findOne(
        {
            where: { 
                id: id,
                userId: req.user.id
            }
        }
    ).then(function(shelf) {
        if (!shelf) {
            return res.status(404).send({
                message: 'No shelf with that identifier has been found'
            });
        } else {
            req.shelf = shelf;
            next();
            return null;
        }
    }).catch(function(err) {
        return next(err);
    });
};

exports.shelfByIngredient = function (req, res, ingredientId) {
    
    if ((ingredientId % 1 === 0) === false) { //check if it's integer
        return res.status(404).send({
            message: 'Ingredient is invalid'
        });
    }
    if (!req.user) {
        return res.status(401).send({
            message: 'Unauthorized. This API route returns user-specific data'
        });
    }
  
    Shelf.findOne(
        {
            where: {
                ingredientId: ingredientId,
                userId: req.user.id
            },
            paranoid: true
        }
    ).then(function(shelf) {
        if (!shelf) {
            req.shelf = {};
        } else {
            req.shelf = shelf;
        }
        return res.json(req.shelf);
    }).catch(function(err) {
        return res.jsonp(err);
    });
};

//TODO setFallbackTo(otherShelf) and setAsOverrideFor(otherShelf)
//TODO fallback to overriden must rewrite fallback to last in the chain
