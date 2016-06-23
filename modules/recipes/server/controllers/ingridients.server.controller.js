'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    async = require('async'),
    cloudinary = require('cloudinary'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    db = require(path.resolve('./config/lib/sequelize')).models,
        Ingridient = db.ingridient
    ;


exports.create = function(req, res) {

    req.body.userId = req.user.id;
    
    var image = '';
    if (req.body.image) {
        image = req.body.image;
        req.body.image='';
    }
    
    Ingridient.create(req.body).then(function(ingridient) {
        if (!ingridient) {
            return res.send('users/signup', {
                errors: 'Could not create the ingridient'
            });
        } else {
            if(image!=='') {
                cloudinary.uploader.upload(image).then(function(result) {
                    image=result.public_id+'.'+result.format;
                    ingridient.update(
                        {
                            image: image
                        }
                    ).then(function() {
                        return res.json(ingridient);
                    });
                });
            } else {
                return res.json(ingridient);
            }
        }
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });       
};

exports.read = function(req, res) {
    res.json(req.ingridient);
};

exports.update = function(req, res) {
    
    Ingridient.findById(req.body.id).then(function(ingridient) {
        if (ingridient) {
            var image = '';
            if (req.body.image) {
                cloudinary.uploader.upload(req.body.image).then(function(result){
                    image=result.public_id+'.'+result.format;
                    ingridient.update(
                        {
                            caption: req.body.caption,
                            infoCard: req.body.infoCard,
                            image: image,
                            measureDefault: req.body.measureDefault
                        }
                    ).then(function() {
                        return res.json(ingridient);
                    }).catch(function(err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    });
                });
            } else {
                ingridient.update(
                    {
                        caption: req.body.caption,
                        infoCard: req.body.infoCard,
                        image: null,
                        measureDefault: req.body.measureDefault
                    }
                ).then(function() {
                    return res.json(ingridient);
                }).catch(function(err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                });
            }       
        } else {
            return res.status(400).send({
                message: 'Unable to find the ingridient'
            });
        }
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};    

exports.delete = function(req, res) {
    
    var ingridient = req.ingridient;
    Ingridient.findById(ingridient.id).then(function(ingridient) {
        if (ingridient) {
            ingridient.destroy().then(function() {
                return res.json(ingridient);
            }).catch(function(err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            });
        } else {
            return res.status(400).send({
                message: 'Unable to find the ingridient'
            });
        }
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};

/**
 * List of ingridients
 */
exports.list = function(req, res) {
    Ingridient.findAll(
        {}
    ).then(function(ingridients) {
        if (!ingridients) {
            return res.status(404).send({
                message: 'No ingridients found'
            });
        } else {
            return res.json(ingridients);
        }
    }).catch(function(err) {
        res.jsonp(err);
    });
};

exports.ingridientByID = function(req, res, next, id) {

    if ((id % 1 === 0) === false) { //check if it's integer
        return res.status(404).send({
            message: 'Ingridient is invalid'
        });
    }
  
    Ingridient.findOne(
        {
            where: {
                id: id
            }
        }
    ).then(function(ingridient) {
        if (!ingridient) {
            return res.status(404).send({
                message: 'No ingridient with that identifier has been found'
            });
        } else {
            req.ingridient = ingridient;
            next();
            return null;
        }
    }).catch(function(err) {
        return next(err);
    });
};