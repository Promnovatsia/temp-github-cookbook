"use strict";

module.exports = function(sequelize, DataTypes) {

    var Ingridient = sequelize.define('ingridient', {
        'index' : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        caption: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER
        }
    },{
        associate: function(models) {
            Ingridient.belongsTo(models.recipe);
            Ingridient.belongsTo(models.measure);
        }
    });
    
return Ingridient;
};