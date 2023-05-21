"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("12345", 10);

    await queryInterface.bulkInsert("Users", [
      {
        id: uuidv4(),
        username: "lucio",
        password: hashedPassword,
        email: "lucio@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { username: "lucio" });
  },
};
