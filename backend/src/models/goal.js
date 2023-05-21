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
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        get() {
          const value = this.getDataValue("amount");
          return parseFloat(value);
        },
        set(value) {
          this.setDataValue("amount", parseFloat(value));
        },
      },
      currentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        get() {
          const value = this.getDataValue("currentAmount");
          return parseFloat(value);
        },
        set(value) {
          this.setDataValue("currentAmount", parseFloat(value));
        },
      },

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
