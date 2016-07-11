"use strict";

module.exports = function (sequelize, DataTypes) {

    var Measure = sequelize.define('measure', {
        caption: {
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
        converter: {
            type: DataTypes.ARRAY(DataTypes.JSONB)
            /*{
                measureId: {
                    type: DataTypes.INTEGER,
                    references:
                        {
                            model: models.measure,
                            key: "id"
                        }
                },
                measureName: {
                    type: DataTypes.STRING
                },
                rate: {
                    type: DateTypes.FLOAT,
                    allowNull: false
                }
            }*/
        }
    }, {
        timestamps: false
    });
    
    return Measure;
};