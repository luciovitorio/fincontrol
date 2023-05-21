"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Installments", {
      id: {
        type: Sequelize.UUID,
        defaultValue: () => uuidv4(),
        allowNull: false,
        primaryKey: true,
      },
      cardId: {
        type: Sequelize.UUID,
        references: {
          model: "CreditCards",
          key: "id",
        },
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      description: {
        type: Sequelize.STRING,
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
        allowNull: false,
      },
      numInstallments: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      paidInstallments: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      dateOfPurchase: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dueDate: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Installments");
  },
};
