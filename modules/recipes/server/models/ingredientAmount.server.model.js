"use strict";

module.exports = function(sequelize, DataTypes) {

    var IngredientAmount = sequelize.define('ingredientAmount', {
        index : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount: {
            type: DataTypes.FLOAT
        },
        measureId: {
            type: DataTypes.INTEGER
        },
        comment: {
            type: DataTypes.STRING
        }
    },{
        timestamps: false
    });
    
return IngredientAmount;
};