"use strict";

module.exports = function(sequelize, DataTypes) {

    var Ingridient = sequelize.define('ingridient', {
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
            Ingridient.belongsToMany(models.recipe, {
                through: models.ingridientAmount
            });
            Ingridient.belongsToMany(models.measure, {
                through: models.ingridientAmount
            });
            Ingridient.hasMany(models.shelf);
        },
        timestamps: false
    });
    
return Ingridient;
};