"use strict";

module.exports = function(sequelize, DataTypes) {

    var Ingridient = sequelize.define('ingridient', {
        caption: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        measure:{
            type: DataTypes.STRING
        }
    },{
        associate: function(models) {
            Ingridient.belongsTo(models.recipe);
        }
    });
    
return Ingridient;
};