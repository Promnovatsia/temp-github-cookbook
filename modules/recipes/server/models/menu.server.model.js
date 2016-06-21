"use strict";

module.exports = function(sequelize, DataTypes) {
    
    var Menu = sequelize.define('menu',{
        week: {
            type: DataTypes.INTEGER
        },
        types: {
            type: DataTypes.JSONB
                /*
                index: DataTypes.INTEGER,
                caption: DataTypes.STRING
                */
        },
        weekDayMask: {
            type: DataTypes.ARRAY(DataTypes.BOOLEAN),
            defaultValue: [true,true,true,true,true,true,false]
        },
        isDone: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },{
        timestamps: false,
        associate: function(models) {
            Menu.belongsTo(models.user);
            Menu.hasMany(models.shelfQuery);
            Menu.belongsToMany(models.recipe,{
                through: models.ingridientAmount
            });
        }
    });

return Menu;    
};