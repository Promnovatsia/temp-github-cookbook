"use strict";

module.exports = function (sequelize, DataTypes) {
    
    var Meal = sequelize.define('meal', {
        type: {
            type: DataTypes.STRING
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
    });

    return Meal;
};