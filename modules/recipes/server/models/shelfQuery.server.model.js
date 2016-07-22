"use strict";

module.exports = function (sequelize, DataTypes) {
    
    var ShelfQuery = sequelize.define('shelfQuery', {
        isClosed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        itemCaption: {
            type: DataTypes.STRING
        },
        buy: {
            type: DataTypes.FLOAT
        },
        bought: {
            type: DataTypes.FLOAT
        },
        buyDate: {
            type: DataTypes.DATE
        },
        use: {
            type: DataTypes.FLOAT
        },
        used: {
            type: DataTypes.FLOAT
        },
        useDate: {
            type: DataTypes.DATE
        },
        spoil: {
            type: DataTypes.FLOAT
        },
        spoilDate: {
            type: DataTypes.DATE
        },
        comment: {
            type: DataTypes.TEXT
        },
        menu: {
            type: DataTypes.INTEGER,
            references: {
                model: "menus",
                key: "id"
            }
        } 
    }, {
        paranoid: true,
        createdAt: false,
        associate: function (models) {
            ShelfQuery.belongsTo(models.user);
            ShelfQuery.belongsTo(models.measure);
            ShelfQuery.belongsTo(models.shelf);
        }
    });

    return ShelfQuery;
};