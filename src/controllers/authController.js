const AsyncHandler = require("express-async-handler");
// const { User } = require("../models");
// const bcrypt = require("bcrypt");
// const generateToken = require("../utils/generateToken");
// const verifyToken = require("../utils/verifyToken");

/**
 * @desc Login
 * @route POST /api/v1/login
 * @access Private
 */
exports.loginAuthController = AsyncHandler(async (req, res) => {
  return res.json({
    message: "Usuário não encontrado",
  });
});

/**
 * @desc Logout
 * @route POST /api/v1/login
 * @access Private
 */
exports.logoutAuthController = (req, res) => {
  return res.json({
    message: "Usuário não encontrado",
  });
};
