"use strict";

module.exports = function (sequelize, DataTypes) {

    var Shelf = sequelize.define('shelf', {
        override: {
            type: DataTypes.INTEGER,
            references: {
                model: "shelves",
                key: "id"
            }
        },
        fallback: {
            type: DataTypes.INTEGER,
            references: {
                model: "shelves",
                key: "id"
            }
        },
        product: {
            type: DataTypes.INTEGER,
            references: {
                model: "products",
                key: "id"
            }
        },
        stored: {
            type: DataTypes.FLOAT
        },
        desired: {
            type: DataTypes.FLOAT
        },
        max: {
            type: DataTypes.FLOAT
        },
        deficit: {
            type: DataTypes.FLOAT
        },
        spoilOpenedAt: {
            type: DataTypes.DATE
        },
        spoilSealedAt: {
            type: DataTypes.DATE
        },
        unsealedAt: {
            type: DataTypes.DATE
        },
        isSpoiled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isSealed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        place: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: true,
        paranoid: true,
        associate: function (models) {
            Shelf.belongsTo(models.user);
            Shelf.belongsTo(models.ingridient);
            Shelf.belongsTo(models.measure);
            Shelf.hasMany(models.shelfQuery);
        }
    });
    
    return Shelf;
};