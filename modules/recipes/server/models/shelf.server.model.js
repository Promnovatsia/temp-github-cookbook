"use strict";

module.exports = function (sequelize, DataTypes) {

    var Shelf = sequelize.define('shelf', {

        isClosed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isRevision: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isStorage: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isResource: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        number: {
            type: DataTypes.INTEGER    
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
        stored: {
            type: DataTypes.FLOAT
        },
        deficit: {
            type: DataTypes.FLOAT
        },
        desired: {
            type: DataTypes.FLOAT
        },
        max: {
            type: DataTypes.FLOAT
        },
        caption: {
            type: DataTypes.STRING        
        },
        place: {
            type: DataTypes.STRING
        },
        measureCaption: { //TODO remove as premature optimization
            type: DataTypes.STRING
        }
    }, {
        scopes: {
            open: {
                where: {
                    isDeleted: false,
                    isClosed: false,
                    isStorage: false,
                    isRevision: false
                }
            },
            restock: {
                where: {
                    isDeleted: false,
                    isClosed: false,
                    isStorage: false,
                    $or: [
                        {
                            stored: {
                                $lt: sequelize.col('deficit')
                            }
                        },
                        {
                            isResource: true,
                            stored: {
                                $lt: sequelize.col('desired')
                            }
                        }
                    ]
                }
            }
        },
        timestamps: true,
        createdAt: false,
        paranoid: true,
        associate: function (models) {
            Shelf.belongsTo(models.user);
            Shelf.belongsTo(models.ingredient);
            Shelf.belongsTo(models.measure);
            Shelf.hasMany(models.request);
        }
    });
    
    return Shelf;
};
