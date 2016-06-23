'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    async = require('async'),
    cloudinary = require('cloudinary'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    db = require(path.resolve('./config/lib/sequelize')).models,
        Product = db.product,
        Ingridient = db.ingridient
    ;

exports.create = function(req, res) {

    req.body.userId = req.user.id;
    
    var image = '';
    if (req.body.image) {
        image = req.body.image;
        req.body.image='';
    }
    
    Product.create(req.body).then(function(product) {
        if (!product) {
            return res.send('users/signup', {
                errors: 'Could not create the product'
            });
        } else {
            if(image!=='') {
                cloudinary.uploader.upload(image).then(function(result) {
                    image=result.public_id+'.'+result.format;
                    product.update(
                        {
                            image: image
                        }
                    ).then(function() {
                        return res.json(product);
                    });
                });
            } else {
                return res.json(product);
            }
        }
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });       
};

exports.read = function(req, res) {
    res.json(req.product);
};

exports.update = function(req, res) {
    
    Product.findById(req.body.id).then(function(product) {
        if (product) {
            var image = '';
            if (req.body.image) {
                cloudinary.uploader.upload(req.body.image).then(function(result){
                    image=result.public_id+'.'+result.format;
                    product.update(
                        {
                            caption: req.body.caption,
                            infoCard: req.body.infoCard,
                            image: image,
                            measureDefault: req.body.measureDefault
                        }
                    ).then(function() {
                        return res.json(product);
                    }).catch(function(err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    });
                });
            } else {
                product.update(
                    {
                        caption: req.body.caption,
                        infoCard: req.body.infoCard,
                        image: null,
                        measureDefault: req.body.measureDefault
                    }
                ).then(function() {
                    return res.json(product);
                }).catch(function(err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                });
            }
        } else {
            return res.status(400).send({
                message: 'Unable to find the product'
            });
        }
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};    

exports.list = function(req, res) {
    Product.findAll(
        {}
    ).then(function(products) {
        if (!products) {
            return res.status(404).send({
                message: 'No products found'
            });
        } else {
            return res.json(products);
        }
    }).catch(function(err) {
        res.jsonp(err);
    });
};

exports.productByID = function(req, res, next, id) {

    if ((id % 1 === 0) === false) { //check if it's integer
        return res.status(404).send({
            message: 'Product is invalid'
        });
    }
  
    Product.findOne(
        {
            where: {
                id: id
            }
        }
    ).then(function(product) {
        if (!product) {
            return res.status(404).send({
                message: 'No product with that identifier has been found'
            });
        } else {
            req.product = product;
            next();
            return null;
        }
    }).catch(function(err) {
        return next(err);
    });
};