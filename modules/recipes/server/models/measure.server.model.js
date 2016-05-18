"use strict";

module.exports = function(sequelize, DataTypes) {

    var Measure = sequelize.define('measure', {
        'index' : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        captionSingular: {
            type: DataTypes.STRING,
            allowNull: false
        },
        captionSemiplural: {
            type: DataTypes.STRING,
            allowNull: false
        },
        captionPlural: {
            type: DataTypes.STRING,
            allowNull: false
        },
        step: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        min: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING
        },
        converter: {
            type: DataTypes.JSONB
            /*{
                measureB: {
                    type: DataTypes.INTEGER,
                    references:
                        {
                            model: models.measure,
                            key: "id"
                        }
                },
                rate: {
                    type: DateTypes.FLOAT,
                    allowNull: false
                }
            }*/
        }
    },{
        associate: function(models) {
            Measure.hasMany(models.ingridientAmount);
        },
        timestamps: false
    });
    
return Measure;
};