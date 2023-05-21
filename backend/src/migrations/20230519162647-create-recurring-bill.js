"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RecurringBills", {
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
      description: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
        allowNull: false,
      },
      initialDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      finishedDate: {
        type: Sequelize.DATE,
      },
      period: {
        type: Sequelize.ENUM("DAILY", "WEEKLY", "MONTHLY"),
        defaultValue: "MONTHLY",
        allowNull: false,
      },
      entryType: {
        type: Sequelize.ENUM("CREDIT", "DEBIT"),
        defaultValue: "DEBIT",
        allowNull: false,
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
    await queryInterface.dropTable("RecurringBills");
  },
};
