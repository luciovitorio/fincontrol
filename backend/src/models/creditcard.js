"use strict";
const { v4: uuidv4 } = require("uuid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CreditCard extends Model {
    static associate(models) {
      CreditCard.belongsTo(models.Account, {
        foreignKey: "accountId",
      });
    }

    toJSON() {
      const attributes = { ...this.get() };
      attributes.expirationDate = attributes.expirationDate
        .toISOString()
        .split("T")[0];
      return attributes;
    }
  }
  CreditCard.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      accountId: DataTypes.UUID,
      alias: DataTypes.STRING,
      flag: {
        type: DataTypes.ENUM,
        values: ["VISA", "MASTERCARD", "AMERICAN"],
        defaultValue: "VISA",
      },
      number: {
        type: DataTypes.STRING,
      },
      dueDate: DataTypes.INTEGER,
      expirationDate: DataTypes.DATE,
      limit: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        get() {
          const value = this.getDataValue("limit");
          return parseFloat(value);
        },
        set(value) {
          this.setDataValue("limit", parseFloat(value));
        },
      },
    },
    {
      sequelize,
      modelName: "CreditCard",
    }
  );

  CreditCard.beforeCreate((creditCard) => {
    creditCard.id = uuidv4();
  });

  return CreditCard;
};
