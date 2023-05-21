"use strict";
const { v4: uuidv4 } = require("uuid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RecurringBill extends Model {
    static associate(models) {
      RecurringBill.belongsTo(models.Account, {
        foreignKey: "accountId",
      });
    }
  }
  RecurringBill.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      accountId: DataTypes.UUID,
      description: DataTypes.STRING,
      amount: DataTypes.DECIMAL(10, 2),
      initialDate: DataTypes.DATE,
      finishedDate: DataTypes.DATE,
      period: {
        type: DataTypes.ENUM,
        values: ["DAILY", "WEEKLY", "MONTHLY"],
        defaultValue: "MONTHLY",
      },
      entryType: {
        type: DataTypes.ENUM,
        values: ["CREDIT", "DEBIT"],
        defaultValue: "DEBIT",
      },
    },
    {
      sequelize,
      modelName: "RecurringBill",
    }
  );

  RecurringBill.beforeCreate((recurringBill) => {
    recurringBill.id = uuidv4();
  });

  return RecurringBill;
};
