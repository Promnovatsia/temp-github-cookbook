'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    async = require('async'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    db = require(path.resolve('./config/lib/sequelize')).models,
        Menu = db.menu
    ;

exports.create = function (req, res) {

    req.body.userId = req.user.id;
    
    Menu.findOne(
        {
            where: {
                userId: req.user.id
            },
            order: [
                ['number','ASC']
            ]
        }
    ).then(function (menu) {
        if (menu) {
            req.body.number = menu.number + 1;    
        } else {
            req.body.number = 1;     
        }
        Menu.create(req.body).then(function (menu) {
            if (!menu) {
                return res.send('users/signup', {
                    errors: 'Could not create the menu'
                });
            } else {
                return res.json(menu);
            }
        }).catch(function (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        });
    });
};

exports.read = function (req, res) {
    res.json(req.menu);
};

exports.update = function (req, res) {
    
    Menu.findOne(
        {
            where: {
                number: req.body.number,
                userId: req.user.id
            }
        }
    ).then(function (menu) {
        if (menu) {
            menu.update(
                {
                    number: req.body.number,
                    types: req.body.types,
                    weekDayMask: req.body.weekDayMask,
                    isDone: req.body.isDone
                }
            ).then(function () {
                return res.json(menu);
            }).catch(function (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            });
        } else {
            return res.status(400).send({
                message: 'Unable to find the menu'
            });
        }
        return null;
    }).catch(function (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};

exports.list = function (req, res) {
    Menu.findAll(
        {
            where: {
                userId: req.user.id
            }
        }
    ).then(function (menus) {
        if (!menus) {
            return res.status(404).send({
                message: 'No menus found'
            });
        } else {
            return res.json(menus);
        }
    }).catch(function (err) {
        res.jsonp(err);
    });
};

exports.menuByID = function (req, res, next, id) {

    if ((id % 1 === 0) === false) { //check if it's integer
        return res.status(404).send({
            message: 'Menu is invalid'
        });
    }
  
    Menu.findOne(
        {
            where: {
                number: id,
                userId: req.user.id
            }
        }
    ).then(function (menu) {
        if (!menu) {
            return res.status(404).send({
                message: 'No menu with that identifier has been found'
            });
        } else {
            req.menu = menu;
            next();
            return null;
        }
    }).catch(function (err) {
        return next(err);
    });
};