const AsyncHandler = require("express-async-handler");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
// const verifyToken = require("../utils/verifyToken");

/**
 * @desc Login
 * @route POST /api/v1/login
 * @access Private
 */
exports.loginAuthController = AsyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: { username },
  });

  if (!user) {
    return res.json({
      message: "Usuário não encontrado",
    });
  }

  // verify if password match
  const verifyPassword = await bcrypt.compare(password, user.password);

  if (!verifyPassword) {
    return res.json({
      message: "Usuário e/ou senha inválido",
    });
  }

  data = {
    id: user.id,
    username: user.username,
    email: user.email,
    token: generateToken(user.id),
  };

  req.userAuth = data;

  return res.json({
    data: data,
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
