"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("creditCards", {
      id: {
        type: Sequelize.UUID,
        defaultValue: () => uuidv4(),
        allowNull: false,
        primaryKey: true,
      },
      accountId: {
        type: Sequelize.UUID,
        references: {
          model: "Accounts",
          key: "id",
        },
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      alias: {
        type: Sequelize.STRING,
      },
      flag: {
        type: Sequelize.ENUM("VISA", "MASTERCARD", "AMERICAN"),
        defaultValue: "VISA",
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      dueDate: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      expirationDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      limit: {
        type: Sequelize.DECIMAL(10, 2),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("creditCards");
  },
};
