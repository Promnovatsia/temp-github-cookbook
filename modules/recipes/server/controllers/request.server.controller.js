'use strict';

var path = require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    db = require(path.resolve('./config/lib/sequelize')).models,
    Request = db.request,
    Shelf = db.shelf;

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
        if (!request) {
            return res.status(400).send({
                message: 'Unable to find the request'
            });
        } else {
            //TODO validate changes and call for shelf update only if needed
            if (request.shelfId === req.body.shelfId &&
                request.measureId === req.body.measureId &&
                request.required === req.body.required &&
                request.needed === req.body.needed &&
                request.buy === req.body.buy)
            {
                return request.update(req.body).then(function (request) {
                    return res.json(request);
                });
            }
            //TODO eliminate situation when resolved request changes shelf on update
            request.needed = req.body.needed || 0;
            return Shelf.findOne(
                {
                    where: {
                        id: req.body.shelfId
                    }
                }
            ).then(function (shelf) {
                if (!shelf) {
                    return res.status(400).send({
                        message: 'Unable to find requested shelf'
                    });
                } else {
                    var diff = shelf.stored - shelf.deficit - req.body.requested - req.body.needed;
                    if (diff >= 0) {
                        shelf.stored = shelf.deficit + diff;
                        req.body.isResolved = true;
                    } else {
                        //TODO restore if resolved request is updated to
                        if (req.body.buy === -diff) {
                            shelf.stored = shelf.deficit;
                            req.body.isResolved = false;
                        }
                        else {
                            return res.status(400).send({
                                message: 'Request has invalid shelf values'
                            });
                        }
                    }
                    return shelf.save({fields: ['stored']}).then(function (shelf) {
                        if (!shelf) {
                            return res.status(400).send({
                                message: 'Unable to process requested shelf'
                            });
                        } else {
                            return request.update(req.body).then(function (request) {
                                return res.json(request);
                            });
                        }
                    });
                }
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
                isResolved: false
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
