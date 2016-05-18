"use strict";

module.exports = function(sequelize, DataTypes) {
    
    var Recipe = sequelize.define('recipe',{
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 250],
                    msg: "Recipe title must be between 1 and 250 characters in length"
                },
            }
        },
        steps: {
            type: DataTypes.ARRAY(DataTypes.JSONB)
                /*'index' : {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                action: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                device: {
                    type: DataTypes.STRING
                },
                duration: {
                    type: DataTypes.STRING
                }*/
        },
        content: {
            type: DataTypes.TEXT
        },
        portions: {
            type: DataTypes.INTEGER,
            defaultValue: 2
        },
        mainIngridient: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },{
        associate: function(models) {
            Recipe.belongsTo(models.user);
            Recipe.belongsToMany(models.ingridient,{
                through: models.ingridientAmount
            });
        }
    });

return Recipe;    
};