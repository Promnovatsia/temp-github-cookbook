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
        measureCaption: {
            type: DataTypes.STRING    
        }
    },{
        associate: function(models) {
            IngredientAmount.belongsTo(models.measure);
        },
        timestamps: false
    });
    
return IngredientAmount;
};