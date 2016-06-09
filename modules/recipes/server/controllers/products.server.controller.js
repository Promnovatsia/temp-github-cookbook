'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    async = require('async'),
    fs = require('fs'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    db = require(path.resolve('./config/lib/sequelize')).models,
        Product = db.product,
        Ingridient = db.ingridient
    ;

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/) , response = {};
        if (matches.length !== 3) {
            console.log('Error in decoding file');
            return new Error('Invalid input string');
        }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
}

exports.create = function(req, res) {

    req.body.userId = req.user.id;
    
    if (req.body.image) {
        var imageBuffer = decodeBase64Image(req.body.image);
        var fileName = req.body.caption + '.jpg';
        fs.writeFile('./public/uploads/products/pictures/'+fileName, imageBuffer.data, function(err) {});
        req.body.image = fileName;
    }
    
    Product.create(req.body).then(function(product) {
        if (!product) {
            return res.send('users/signup', {
                errors: 'Could not create the product'
            });
        } else {
            return res.json(product);
        }
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });       
};

/**
 * Show the current ingridient
 */
exports.read = function(req, res) {
    res.json(req.product);
};

exports.update = function(req, res) {
    
    // Find the recipe
    Product.findById(req.body.id).then(function(product) {
        if (product) {
            
            var fileName;
            if (req.body.image) {
                var imageBuffer = decodeBase64Image(req.body.image);
                fileName = req.body.caption + '.jpg';
                fs.writeFile('./public/uploads/products/pictures/'+fileName, imageBuffer.data, function(err) {
                    if (err){
                        console.log('Error in write file');
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }    
                });
            }
            
            product.update(
                {
                    caption: req.body.caption,
                    infoCard: req.body.infoCard,
                    image: fileName,
                    measureId: req.body.measureId
                }
            ).then(function() {
                return res.json(product);
            }).catch(function(err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            });
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