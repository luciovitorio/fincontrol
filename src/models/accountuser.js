"use strict";
const { v4: uuidv4 } = require("uuid");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AccountUser extends Model {
    static associate(models) {
      AccountUser.belongsTo(models.User, {
        foreignKey: "userId",
      });

      AccountUser.belongsTo(models.Account, {
        foreignKey: "accountId",
      });
    }
  }
  AccountUser.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        primaryKey: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Accounts",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "AccountUser",
    }
  );

  AccountUser.beforeCreate((accountUser, options) => {
    accountUser.id = uuidv4();
  });

  return AccountUser;
};
