"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Logs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: () => uuidv4(),
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      },
      type: {
        type: Sequelize.ENUM("CREATE", "UPDATE", "DELETE"),
        defaultValue: "CREATE",
        allowNull: false,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      table: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Logs");
  },
};
