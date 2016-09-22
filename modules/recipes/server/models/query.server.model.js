"use strict";

module.exports = function (sequelize, DataTypes) {

    var Query = sequelize.define('query', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
            Query.belongsTo(models.user);
            Query.belongsTo(models.measure);
            Query.belongsTo(models.shelf);
            Query.belongsTo(models.menu);
        }
    });

    return Query;
};
