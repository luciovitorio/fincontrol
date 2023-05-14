const express = require("express");
const {
  loginAuthController,
  logoutAuthController,
} = require("../../controllers/authController");

const authRoute = express.Router();

authRoute.get("/login", loginAuthController);

authRoute.post("/logout", logoutAuthController);

module.exports = authRoute;
