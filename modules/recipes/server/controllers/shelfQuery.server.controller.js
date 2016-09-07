'use strict';
/**
 * Module dependencies.
 */
var path = require('path'),
    async = require('async'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    db = require(path.resolve('./config/lib/sequelize')).models,
    Shelf = db.shelf,
    ShelfQuery = db.shelfQuery;

exports.create = function(req, res) {

    req.body.userId = req.user.id; 
    req.body.shelfId = req.shelf.id;
    
    ShelfQuery.create(req.body).then(function(shelfQuery) {
        if (!shelfQuery) {
            return res.send('users/signup', {
                errors: 'Could not create the shelf query'
            });
        } else {
            return res.json(shelfQuery);
        }
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });       
};

exports.read = function(req, res) {
    res.json(req.shelfQuery);
};

exports.update = function(req, res) {
    
    if (!req.shelf) {
        return res.status(400).send({
            message: 'Bad request. Specify shelf id first'
        });
    }
    ShelfQuery.findOne(
        {
            where: { 
                number: req.body.number,
                shelfId: req.shelf.id
            }
        }
    ).then(function(shelfQuery) {
        if (shelfQuery) {
            shelfQuery.update(req.body).then(function(shelfQuery) {
                return res.json(shelfQuery);
            }).catch(function(err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            });
        return null;
        } else {
            return res.status(400).send({
                message: 'Unable to find the shelf query'
            });
        }
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};    

exports.list = function(req, res) {
    if (!req.shelf) {
        return res.status(400).send({
            message: 'Bad request. Specify shelf id first'
        });
    }
    ShelfQuery.findAll(
        {
            where: { 
                shelfId: req.shelf.id
            }
        }
    ).then(function(shelfQueries) {
        if (!shelfQueries) {
            return res.status(404).send({
                message: 'No shelf queries found'
            });
        } else {
            return res.json(shelfQueries);
        }
    }).catch(function(err) {
        res.jsonp(err);
    });
};

exports.queryByID = function(req, res, next, id) {

    if ((id % 1 === 0) === false) { //check if it's integer
        return res.status(404).send({
            message: 'Shelf query is invalid'
        });
    }
    if (!req.shelf) {
        return res.status(400).send({
            message: 'Bad request. Specify shelf id first'
        });
    }
  
    ShelfQuery.findOne(
        {
            where: { 
                number: id,
                shelfId: req.shelf.id
            }
        }
    ).then(function(shelfQuery) {
        if (!shelfQuery) {
            return res.status(404).send({
                message: 'No shelf query with that identifier has been found'
            });
        } else {
            req.shelfQuery = shelfQuery;
            next();
            return null;
        }
    }).catch(function(err) {
        return next(err);
    });
};