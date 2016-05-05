"use strict";

module.exports = function(sequelize, DataTypes) {

    var Step = sequelize.define('step',{
        action: {
            type: DataTypes.STRING,
            allowNull: false
        },
        device: {
            type: DataTypes.STRING
        },
        duration: {
            type: DataTypes.STRING
    //TODO add validation
        }
    },{
        associate: function(models) {
            Step.belongsTo(models.recipe);
        }
    });
    
return Step;
};