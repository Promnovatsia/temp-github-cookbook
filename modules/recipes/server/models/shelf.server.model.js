"use strict";

module.exports = function(sequelize, DataTypes) {

    var Shelf = sequelize.define('shelf', {
        caption: {
            type: DataTypes.STRING,
            allowNull: false
        },
        minStorage: {
            type: DataTypes.INTEGER
        },
        maxStorage: {
            type: DataTypes.INTEGER
        },
        currentStorage: {
            type: DataTypes.INTEGER
        },
        desiredStorage: {
            type: DataTypes.INTEGER
        },
        
        
    },{
        associate: function(models) {
            //Ingridient.belongsTo(models.recipe);
            //Ingridient.belongsTo(models.measure);
        }
    });
    
return Shelf;
};