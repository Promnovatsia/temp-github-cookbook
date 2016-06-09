"use strict";

module.exports = function(sequelize, DataTypes) {
    
    var Meal = sequelize.define('meal',{
        type: {
            type: DataTypes.STRING
        },
        portions: {
            type: DataTypes.INTEGER,
            defaultValue: 2
        },
        comment: {
            type: DataTypes.TEXT
        },
        isDone: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },{
        timestamps: true,
        paranoid: true,
        createdAt: false,
        associate: function(models) {
            Meal.belongsTo(models.user);
            Meal.belongsTo(models.recipe);
            Meal.hasMany(models.shelfQuery);
        }
    });

return Meal;    
};