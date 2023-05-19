"use strict";
const { v4: uuidv4 } = require("uuid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class creditCard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  creditCard.init(
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
        type: DataTypes.INTEGER,
        unique: true,
      },
      dueDate: DataTypes.DATE,
      limit: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "creditCard",
    }
  );

  creditCard.beforeCreate((creditCard) => {
    creditCard.id = uuidv4();
  });

  return creditCard;
};
