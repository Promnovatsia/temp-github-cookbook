"use strict";

module.exports = function (sequelize, DataTypes) {
    
    var Meal = sequelize.define('meal', {
        type: {
            type: DataTypes.INTEGER
        },
        weekday: {
            type: DataTypes.INTEGER
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
        },
        startTime: {
            type: DataTypes.INTEGER
        },
        serveTime: {
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: true,
        paranoid: true,
        createdAt: false
    }, {
        associate: function (models) {
            Meal.belongsTo(models.recipe);
            Meal.belongsTo(models.menu);
        }});

    return Meal;
};