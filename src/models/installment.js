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
      totalAmount: DataTypes.DECIMAL(10, 2),
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
