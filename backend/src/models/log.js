"use strict";
const { v4: uuidv4 } = require("uuid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Log.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      userId: DataTypes.UUID,
      type: {
        type: DataTypes.ENUM,
        values: ["CREATE", "UPDATE", "DELETE"],
        defaultValue: "CREATE",
      },
      metadata: DataTypes.JSON,
      table: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Log",
    }
  );

  Log.beforeCreate((log, options) => {
    log.id = uuidv4();
  });

  return Log;
};
