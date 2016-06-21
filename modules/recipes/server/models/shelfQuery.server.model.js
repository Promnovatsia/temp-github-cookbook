"use strict";

module.exports = function(sequelize, DataTypes) {
    
    var ShelfQuery = sequelize.define('shelfQuery',{
        requested: {
            type: DataTypes.FLOAT
        },
        recieved: {
            type: DataTypes.FLOAT
        },
        comment: {
            type: DataTypes.TEXT
        },
        isDelivered: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        menu: {
            type: DataTypes.INTEGER,
            references: {
                model: "menus",
                key: "id"
            }
        }
    },{
        paranoid: true,
        associate: function(models) {
            ShelfQuery.belongsTo(models.user);
            ShelfQuery.belongsTo(models.measure);
            ShelfQuery.belongsTo(models.shelf);
            //ShelfQuery.belongsTo(models.trelloCard);
        }
    });

return ShelfQuery;  
};