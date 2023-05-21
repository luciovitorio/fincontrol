"use strict";
const { v4: uuidv4 } = require("uuid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.belongsToMany(models.User, {
        through: "AccountUsers",
        foreignKey: "accountId",
        otherKey: "userId",
      });
      Account.hasMany(models.CreditCard, {
        foreignKey: "accountId",
      });
    }
  }
  Account.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      number: {
        type: DataTypes.STRING,
        unique: true,
      },
      type: {
        type: DataTypes.ENUM,
        values: ["CURRENT", "SAVING"],
        defaultValue: "CURRENT",
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2).UNSIGNED,
        defaultValue: 0.0,
        get() {
          const value = this.getDataValue("balance");
          return parseFloat(value);
        },
        set(value) {
          this.setDataValue("balance", parseFloat(value));
        },
      },
    },
    {
      sequelize,
      modelName: "Account",
    }
  );

  Account.beforeCreate((account, options) => {
    account.id = uuidv4();
  });

  return Account;
};
