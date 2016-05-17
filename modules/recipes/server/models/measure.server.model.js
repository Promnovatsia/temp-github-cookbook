"use strict";

module.exports = function(sequelize, DataTypes) {

    var Measure = sequelize.define('measure', {
        'index' : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        caption: {
            type: DataTypes.STRING,
            allowNull: false
        },
        measureStep: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        associate: function(models) {
            Measure.hasMany(models.ingridient);
        }
    });
    
return Measure;
};