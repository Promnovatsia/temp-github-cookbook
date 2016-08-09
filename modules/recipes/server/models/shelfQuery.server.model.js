"use strict";

module.exports = function (sequelize, DataTypes) {
    
    var ShelfQuery = sequelize.define('shelfQuery', {
        number: {
            type: DataTypes.INTEGER
        },
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
        }
    }, {
        paranoid: true,
        createdAt: false,
        associate: function (models) {
            ShelfQuery.belongsTo(models.user);
            ShelfQuery.belongsTo(models.measure);
            ShelfQuery.belongsTo(models.shelf);
            ShelfQuery.belongsTo(models.menu);
        }
    });

    return ShelfQuery;
};