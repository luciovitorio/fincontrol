"use strict";
const { v4: uuidv4 } = require("uuid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Installment extends Model {
    static associate(models) {
      Installment.belongsTo(models.CreditCard, {
        foreignKey: "cardId",
      });
    }
  }
  Installment.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      cardId: DataTypes.UUID,
      description: DataTypes.STRING,
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        get() {
          const value = this.getDataValue("totalAmount");
          return parseFloat(value);
        },
        set(value) {
          this.setDataValue("totalAmount", parseFloat(value));
        },
      },
      numInstallments: DataTypes.INTEGER,
      paidInstallments: DataTypes.INTEGER,
      dateOfPurchase: DataTypes.DATE,
      dueDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Installment",
    }
  );
  Installment.beforeCreate((intallment) => {
    intallment.id = uuidv4();
  });

  return Installment;
};
