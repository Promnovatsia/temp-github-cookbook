"use strict";

module.exports = function (sequelize, DataTypes) {
    
    var Menu = sequelize.define('menu', {
        number: {
            type: DataTypes.INTEGER
        },
        startDate: {
            type: DataTypes.DATE  
        },
        isPurchased: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isDone: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        weekDayMask: {
            type: DataTypes.ARRAY(DataTypes.BOOLEAN),
            defaultValue: [true, true, true, true, true, true, false]
        },
        types: {
            type: DataTypes.ARRAY(DataTypes.JSONB)
            /*{
                caption: {
                    type: DataTypes.STRING
                },
                serveTime: {
                    type: DataTypes.INTEGER
                }
            }*/
        }
    }, {
        timestamps: false,
        associate: function (models) {
            Menu.belongsTo(models.user);
            Menu.hasMany(models.shelfQuery);
            Menu.belongsToMany(models.recipe, {
                through: models.meal
            });
        }
    });

    return Menu;
};