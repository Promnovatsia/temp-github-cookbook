'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    async = require('async'),
    fs = require('fs'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    db = require(path.resolve('./config/lib/sequelize')).models,
        Recipe = db.recipe,
        Step = db.step,
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
/**
 * Create an ingridient
 */
exports.create = function(req, res) {

    req.body.userId = req.user.id;
    
    if (req.body.image) {
        var imageBuffer = decodeBase64Image(req.body.image);
        var fileName = req.body.caption + '.jpg';
        fs.writeFile('./public/uploads/ingridients/pictures/'+fileName, imageBuffer.data, function(err) {});
        req.body.image = fileName;
    }
    
    Ingridient.create(req.body).then(function(ingridient) {
        if (!ingridient) {
            return res.send('users/signup', {
                errors: 'Could not create the ingridient'
            });
        } else {
            return res.json(ingridient);
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
    res.json(req.ingridient);
};

/**
 * Update a ingridient
 */
exports.update = function(req, res) {
    
    // Find the recipe
    Ingridient.findById(req.body.id).then(function(ingridient) {
        if (ingridient) {
            
            var fileName;
            if (req.body.image) {
                var imageBuffer = decodeBase64Image(req.body.image);
                fileName = req.body.caption + '.jpg';
                fs.writeFile('./public/uploads/ingridients/pictures/'+fileName, imageBuffer.data, function(err) {
                    if (err){
                        console.log('Error in write file');
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }    
                });
            }
            
            ingridient.update(
                {
                    caption: req.body.caption,
                    infoCard: req.body.infoCard,
                    image: fileName,
                    measureDefault: req.body.measureDefault
                }
            ).then(function() {
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
 * Delete an ingridient
 */
exports.delete = function(req, res) {
    
    var ingridient = req.ingridient;
    // Find the ingridient
    Ingridient.findById(ingridient.id).then(function(recipe) {
        if (recipe) {
            // Delete the ingridient
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
            console.log(ingridient);
            req.ingridient = ingridient;
            next();
            return null;
        }
    }).catch(function(err) {
        return next(err);
    });
};