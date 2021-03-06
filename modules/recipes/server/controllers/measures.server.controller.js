'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    async = require('async'),
    fs = require('fs'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    db = require(path.resolve('./config/lib/sequelize')).models,
    Measure = db.measure;

exports.create = function (req, res) {
    Measure.create(req.body).then(function (measure) {
        if (!measure) {
            return res.send('users/signup', {
                errors: 'Could not create the measure'
            });
        } else {
            return res.json(measure);
        }
    }).catch(function (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });       
};

exports.read = function (req, res) {
    res.json(req.measure);
};

exports.update = function (req, res) {
    Measure.findById(req.body.id).then(function (measure) {
        measure.update(req.body).then(function (measure) {
            if (!measure) {
                return res.status(404).send({
                    message: 'No measure found'
                });
            } else {
                return res.json(measure);
            }
        }).catch(function (err) {
            res.json(err);
        });
        return null;
    }).catch(function (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });
};

exports.list = function (req, res) {
    Measure.findAll({    
    }).then(function (measures) {
        if (!measures) {
            return res.status(404).send({
                message: 'No measures found'
            });
        } else {
            return res.json(measures);
        }
    }).catch(function (err) {
        res.jsonp(err);
    });
};

exports.measureByID = function (req, res, next, id) {

    if ((id % 1 === 0) === false) { //check if it's integer
        return res.status(404).send({
            message: 'Measure is invalid'
        });
    }
  
    Measure.findOne({
        where: {
            id: id
        }
    }).then(function (measure) {
        if (!measure) {
            return res.status(404).send({
                message: 'No measure with that identifier has been found'
            });
        } else {
            req.measure = measure;
            next();
            return null;
        }
    }).catch(function (err) {
        return next(err);
    });
};