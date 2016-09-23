'use strict';

var path = require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    db = require(path.resolve('./config/lib/sequelize')).models,
    Request = db.request;

exports.create = function(req, res) {

    req.body.userId = req.user.id;

    Request.create(req.body).then(function(request) {
        if (!request) {
            return res.send('users/signup', {
                errors: 'Could not create the request'
            });
        } else {
            return res.json(request);
        }
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};

exports.read = function(req, res) {
    res.json(req.request);
};

exports.update = function(req, res) {

    Request.findOne(
        {
            where: {
                id: req.body.id
            }
        }
    ).then(function(request) {
        if (request) {
            request.update(req.body).then(function(request) {
                return res.json(request);
            }).catch(function(err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            });
            return null;
        } else {
            return res.status(400).send({
                message: 'Unable to find the request'
            });
        }
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};

exports.list = function(req, res) {

    if (!req.user) {
        return res.status(401).send({
            message: 'Unauthorized. This returns user-specific data'
        });
    }
    Request.findAll(
        {
            where: {
                userId: req.user.id,
                isClosed: false
            }
        }
    ).then(function(requests) {
        if (!requests) {
            return res.status(404).send({
                message: 'No requests found'
            });
        } else {
            return res.json(requests);
        }
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};

exports.requestByMenu = function(req, res) {

    if (!req.menu) {
        return res.status(400).send({
            message: 'Bad request. Specify menu first'
        });
    }
    Request.findAll(
        {
            where: {
                menuId: req.menu.id
            }
        }
    ).then(function(requests) {
        if (!requests) {
            req.requests = {};
        } else {
            req.requests = requests;
        }
        return res.json(req.requests);
    }).catch(function (err) {
        return res.jsonp(err);
    });
};

exports.requestByShelf = function(req, res) {

    if (!req.shelf) {
        return res.status(400).send({
            message: 'Bad request. Specify shelf first'
        });
    }
    Request.findAll(
        {
            where: {
                shelfId: req.shelf.id
            }
        }
    ).then(function(requests) {
        if (!requests) {
            req.requests = {};
        } else {
            req.requests = requests;
        }
        return res.json(req.requests);
    }).catch(function (err) {
        return res.jsonp(err);
    });
};

exports.requestPublicByID = function(req, res) {

    Request.findOne(
        {
            where: {
                id: req.body.id,
                isPublic: true
            }
        }
    ).then(function(request) {
        if (!request) {
            return res.status(404).send({
                message: 'No request found'
            });
        } else {
            return res.json(request);
        }
    }).catch(function (err) {
        return res.jsonp(err);
    });
};

exports.requestByID = function(req, res, next, id) {

    if (!req.user) {
        return res.status(401).send({
            message: 'Unauthorized. This returns user-specific data'
        });
    }
    Request.findOne(
        {
            where: {
                id: id,
                userId: req.user.id
            }
        }
    ).then(function(request) {
        if (!request) {
            return res.status(404).send({
                message: 'No request with that identifier has been found'
            });
        } else {
            req.request = request;
            next();
            return null;
        }
    }).catch(function(err) {
        return next(err);
    });
};
