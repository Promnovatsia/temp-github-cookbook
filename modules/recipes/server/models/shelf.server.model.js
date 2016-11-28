"use strict";

module.exports = function (sequelize, DataTypes) {

    var Shelf = sequelize.define('shelf', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        fallback: {
            type: DataTypes.UUID,
            references: {
                model: "shelves",
                key: "id"
            },
            comment: 'if set to shelf uuid owned by same user all requests will redirect to fallback shelf instead'
        },
        isRestricted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'if set no request can change stored amount, no fallback'
        },
        isClosed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'if set allows only manual requests, does not notify'
        },
        isStorage: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'if set direct checkout will require confirmation, but fallback to this will be resolved'
        },
        isResource: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'if set enables restock by autogenerating requests to reach desired value'
        },
        stored: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            },
            comment: 'value available for reservation and using by resolving requests'
        },
        deficit: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            },
            comment: 'value acting as effective null, no resovle can lower stored value below this'
        },
        desired: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            },
            comment: 'value acting as target for restock'
        },
        max: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            },
            comment: 'value acting as visible limit to stored indication'
        },
        place: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'value used to group similar placed items together'
        },
        caption: {
            type: DataTypes.STRING,
            comment: 'overrides ingredient caption if not null'
        }
    }, {
        scopes: {
            open: { //regular shelves that acts as normal
                where: {
                    isRestricted: false,
                    isClosed: false,
                    isStorage: false,
                }
            },
            restock: { //shelves recommended to restock
                where: {
                    isRestricted: false,
                    isStorage: false,
                    $or: [
                        {
                            stored: {
                                $lt: {$col: 'deficit'} /*sequelize.col('deficit')*/
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
