"use strict";

module.exports = function (sequelize, DataTypes) {
    
    var Recipe = sequelize.define('recipe', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 250],
                    msg: "Recipe title must be between 1 and 250 characters in length"
                }
            }
        },
        isPrivate: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        author: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        infoCard: {
            type: DataTypes.TEXT
        },
        portions: {
            type: DataTypes.INTEGER,
            defaultValue: 2
        },
        mainIngredient: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        content: {
            type: DataTypes.TEXT
        },
        steps: {
            type: DataTypes.ARRAY(DataTypes.JSONB)
            /*{
                'index' : {
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
                },
                image: {
                    type: DataTypes.STRING
                }
            }*/
        }
    }, {
        associate: function (models) {
            Recipe.belongsTo(models.user);
            Recipe.belongsToMany(models.ingredient, {
                through: models.ingredientAmount
            });
            Recipe.hasMany(models.meal);
        }
    });

    return Recipe;
};