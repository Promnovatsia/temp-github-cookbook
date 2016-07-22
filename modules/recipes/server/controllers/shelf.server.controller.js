'use strict';
//FUTURE shelf feature
/**
 * Module dependencies.
 */
var path = require('path'),
    async = require('async'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    db = require(path.resolve('./config/lib/sequelize')).models,
    Shelf = db.shelf;

exports.create = function(req, res) {

    req.body.userId = req.user.id;
    
    Shelf.create(req.body).then(function(shelf) {
        if (!shelf) {
            return res.send('users/signup', {
                errors: 'Could not create the shelf'
            });
        } else {
            return res.json(shelf);
        }
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });       
};

exports.read = function(req, res) {
    var shelf = req.shelf;
    shelf.isCurrentUserOwner = !!(req.user && shelf.userId && shelf.userId === req.user.id);
    res.json(shelf);
};

exports.update = function(req, res) {
    
    Shelf.findById(req.body.id).then(function(shelf) {
        if (shelf) {
            shelf.update(req.body).then(function(shelf) {
                return res.json(shelf);
            }).catch(function(err) {
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

exports.list = function(req, res) {
    Shelf.findAll(
        {}
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

exports.shelfByID = function(req, res, next, id) {

    if ((id % 1 === 0) === false) { //check if it's integer
        return res.status(404).send({
            message: 'Shelf is invalid'
        });
    }
  
    Shelf.findOne(
        {
            where: {
                id: id
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