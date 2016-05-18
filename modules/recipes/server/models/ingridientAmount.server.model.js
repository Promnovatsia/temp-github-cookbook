"use strict";

module.exports = function(sequelize, DataTypes) {

    var IngridientAmount = sequelize.define('ingridientAmount', {
        'index' : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount: {
            type: DataTypes.FLOAT
        }
    },{
        associate: function(models) {
            IngridientAmount.belongsTo(models.measure);
        },
        timestamps: false
    });
    
return IngridientAmount;
};