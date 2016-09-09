"use strict";

module.exports = function (sequelize, DataTypes) {

    var Shelf = sequelize.define('shelf', {
        
        number: {
            type: DataTypes.INTEGER    
        },
        caption: {
            type: DataTypes.STRING        
        },
        measureCaption: {
            type: DataTypes.STRING        
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
        isSpoiled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        place: {
            type: DataTypes.STRING
        },
        lastQuery: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
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
        /* FUTURE product integration
        product: {
            type: DataTypes.INTEGER,
            references: {
                model: "products",
                key: "id"
            }
        },*/
    }, {
        timestamps: true,
        createdAt: false,
        paranoid: true,
        associate: function (models) {
            Shelf.belongsTo(models.user);
            Shelf.belongsTo(models.ingredient);
            Shelf.belongsTo(models.measure);
            Shelf.hasMany(models.shelfQuery);
        }
    });
    
    return Shelf;
};