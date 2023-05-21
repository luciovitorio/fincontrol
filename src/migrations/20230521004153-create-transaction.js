"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: () => uuidv4(),
        allowNull: false,
        primaryKey: true,
      },
      categoryId: {
        type: Sequelize.UUID,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      accountId: {
        type: Sequelize.UUID,
        references: {
          model: "Accounts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      goalId: {
        type: Sequelize.UUID,
        references: {
          model: "Goals",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      cardId: {
        type: Sequelize.UUID,
        references: {
          model: "CreditCards",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      installmentId: {
        type: Sequelize.UUID,
        references: {
          model: "Installments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      entryType: {
        type: Sequelize.ENUM("CREDIT", "DEBIT"),
        defaultValue: "DEBIT",
        allowNull: false,
      },
      paymentType: {
        type: Sequelize.ENUM("CREDITCARD", "PIX", "MONEY", "DEBITCARD"),
        defaultValue: "CREDITCARD",
        allowNull: false,
      },
      dateOper: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
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
    await queryInterface.dropTable("Transactions");
  },
};
