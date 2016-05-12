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
        content: {
            type: DataTypes.TEXT
        }
    },{
        associate: function(models) {
            Recipe.belongsTo(models.user);
            Recipe.hasMany(models.ingridient, { onDelete: 'cascade' });
            Recipe.hasMany(models.step, { onDelete: 'cascade' });
        }
    });

return Recipe;    
};