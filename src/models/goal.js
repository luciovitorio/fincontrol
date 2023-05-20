"use strict";
const { v4: uuidv4 } = require("uuid");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Goal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Goal.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      amount: DataTypes.DECIMAL(10, 2),
      currentAmount: DataTypes.DECIMAL(10, 2),
      startDate: DataTypes.DATE,
      finishedDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Goal",
    }
  );
  Goal.beforeCreate((goal) => {
    goal.id = uuidv4();
  });

  return Goal;
};
