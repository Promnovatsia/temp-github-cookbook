'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    async = require('async'),
/*    fs = require('fs'),*/
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    db = require(path.resolve('./config/lib/sequelize')).models,
        Menu = db.menu,
        Ingridient = db.ingridient
    ;

/*function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/) , response = {};
        if (matches.length !== 3) {
            console.log('Error in decoding file');
            return new Error('Invalid input string');
        }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
}*/

exports.create = function(req, res) {

    req.body.userId = req.user.id;
    
    /*if (req.body.image) {
        var imageBuffer = decodeBase64Image(req.body.image);
        var fileName = req.body.caption + '.jpg';
        fs.writeFile('./public/uploads/menus/pictures/'+fileName, imageBuffer.data, function(err) {});
        req.body.image = fileName;
    }*/
    
    Menu.create(req.body).then(function(menu) {
        if (!menu) {
            return res.send('users/signup', {
                errors: 'Could not create the menu'
            });
        } else {
            return res.json(menu);
        }
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });       
};

exports.read = function(req, res) {
    res.json(req.menu);
};

exports.update = function(req, res) {
    
    Menu.findById(req.body.id).then(function(menu) {
        if (menu) {
            /*var fileName;
            if (req.body.image) {
                var imageBuffer = decodeBase64Image(req.body.image);
                fileName = req.body.caption + '.jpg';
                fs.writeFile('./public/uploads/menus/pictures/'+fileName, imageBuffer.data, function(err) {
                    if (err){
                        console.log('Error in write file');
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }    
                });
            }*/ 
            menu.update(
                {
                    week: req.body.week,
                    types: req.body.types,
                    weekDayMask: req.body.weekDayMask,
                    isDone: req.body.isDone
                }
            ).then(function() {
                return res.json(menu);
            }).catch(function(err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            });
        } else {
            return res.status(400).send({
                message: 'Unable to find the menu'
            });
        }
    }).catch(function(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};    

exports.list = function(req, res) {
    Menu.findAll(
        {}
    ).then(function(menus) {
        if (!menus) {
            return res.status(404).send({
                message: 'No menus found'
            });
        } else {
            return res.json(menus);
        }
    }).catch(function(err) {
        res.jsonp(err);
    });
};

exports.menuByID = function(req, res, next, id) {

    if ((id % 1 === 0) === false) { //check if it's integer
        return res.status(404).send({
            message: 'Menu is invalid'
        });
    }
  
    Menu.findOne(
        {
            where: {
                id: id
            }
        }
    ).then(function(menu) {
        if (!menu) {
            return res.status(404).send({
                message: 'No menu with that identifier has been found'
            });
        } else {
            req.menu = menu;
            next();
            return null;
        }
    }).catch(function(err) {
        return next(err);
    });
};