"use strict";

module.exports = function (sequelize, DataTypes) {
    
    var Menu = sequelize.define('menu', {
        number: {
            type: DataTypes.INTEGER
        },
        startDate: {
            type: DataTypes.DATE  
        },
        isClosed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
            Menu.hasMany(models.meal);
        }
    });

    return Menu;
};