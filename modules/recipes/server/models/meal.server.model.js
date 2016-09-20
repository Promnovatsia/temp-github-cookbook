"use strict";

module.exports = function (sequelize, DataTypes) {
    
    var Meal = sequelize.define('meal', {
        weekday: {
            type: DataTypes.INTEGER
        },
        type: {
            type: DataTypes.INTEGER
        },
        portions: {
            type: DataTypes.FLOAT,
            defaultValue: 2
        },
        isFulfilled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isDone: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        rating: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        startTime: {
            type: DataTypes.DATE
        },
        serveTime: {
            type: DataTypes.DATE
        },
        comment: {
            type: DataTypes.STRING
        }
        //FUTURE override ingredientsAmount
    }, {
        timestamps: true,
        paranoid: true,
        createdAt: false,
        associate: function (models) {
            Meal.belongsTo(models.recipe);
            Meal.belongsTo(models.menu);
        }
    });

    return Meal;
};