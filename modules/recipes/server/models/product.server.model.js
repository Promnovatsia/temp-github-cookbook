"use strict";

module.exports = function(sequelize, DataTypes) {

    var Product = sequelize.define('product', {
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
        defaultIngridient: {
            type: DataTypes.INTEGER,
            references: {
                model: "ingridients",
                key: "id"
            }
        },
        shelfLifeSealed: {
            type: DataTypes.INTEGER
        },
        shelfLifeOpened: {
            type: DataTypes.INTEGER
        },
        isUnsealable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        amount: {
            type: DataTypes.FLOAT
        },
        nutrition: {
            type: DataTypes.JSONB
            /*energy : {
                    type: DataTypes.FLOAT
            },
            fat: {
                    type: DataTypes.FLOAT
            },
            protein: {
                    type: DataTypes.FLOAT
            },
            carbohydrates: {
                    type: DataTypes.FLOAT
            }*/
        }
    },{
        timestamps: false,
        associate: function(models) {
            Product.belongsTo(models.measure);
        }
    });
    
return Product;
};