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
            //TODO validate as URL
        },
        measureDefault: {
            type: DataTypes.INTEGER,
            references: {
                model: "measures",
                key: "id"
            }
        },
        measureType: {
            type: DataTypes.STRING
        }
    },{
        associate: function(models) {
            Ingridient.belongsToMany(models.recipe, {
                through: models.ingridientAmount
            });
        },
        timestamps: false
    });
    
return Ingridient;
};