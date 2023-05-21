"use strict";
const { v4: uuidv4 } = require("uuid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {}
  }
  Transaction.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      categoryId: DataTypes.UUID,
      accountId: DataTypes.UUID,
      goalId: DataTypes.UUID,
      cardId: DataTypes.UUID,
      installmentId: DataTypes.UUID,
      amount: DataTypes.DECIMAL(10, 2),
      entryType: {
        type: DataTypes.ENUM,
        values: ["CREDIT", "DEBIT"],
        defaultValue: "DEBIT",
      },
      paymentType: {
        type: DataTypes.ENUM,
        values: ["CREDITCARD", "PIX", "MONEY", "DEBITCARD"],
        defaultValue: "CREDITCARD",
      },
      dateOper: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  Transaction.beforeCreate((transaction) => {
    transaction.id = uuidv4();
  });

  return Transaction;
};
