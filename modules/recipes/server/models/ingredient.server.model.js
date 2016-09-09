"use strict";

module.exports = function(sequelize, DataTypes) {

    var Ingredient = sequelize.define('ingredient', {
        caption: {
            type: DataTypes.STRING,
            allowNull: false
        },
        infoCard: {
            type: DataTypes.TEXT
        },
        image: {
            type: DataTypes.STRING
        },
        measureDefault: {
            type: DataTypes.INTEGER,
            references: {
                model: "measures",
                key: "id"
            }
        }
    },{
        associate: function(models) {
            Ingredient.belongsToMany(models.recipe, {
                through: models.ingredientAmount
            });
            Ingredient.belongsToMany(models.measure, {
                through: models.ingredientAmount
            });
            Ingredient.hasMany(models.shelf);
        },
        timestamps: false
    });
    
return Ingredient;
};