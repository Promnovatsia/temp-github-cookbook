"use strict";

module.exports = function (sequelize, DataTypes) {

    var Request = sequelize.define('request', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        isClosed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        buy: {
            type: DataTypes.FLOAT
        },
        bought: {
            type: DataTypes.FLOAT
        },
        use: {
            type: DataTypes.FLOAT
        },
        used: {
            type: DataTypes.FLOAT
        },
        spoil: {
            type: DataTypes.FLOAT
        },
        buyDate: {
            type: DataTypes.DATE
        },
        useDate: {
            type: DataTypes.DATE
        },
        spoilDate: {
            type: DataTypes.DATE
        },
        itemCaption: {
            type: DataTypes.STRING
        },
        category: {
            type: DataTypes.STRING
        },
        comment: {
            type: DataTypes.STRING
        }
    }, {
        paranoid: true,
        associate: function (models) {
            Request.belongsTo(models.user);
            Request.belongsTo(models.measure);
            Request.belongsTo(models.shelf);
            Request.belongsTo(models.menu);
        }
    });

    return Request;
};
