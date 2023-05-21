const AsyncHandler = require("express-async-handler");
const { User } = require("../models");
const verifyToken = require("../utils/verifyToken");

const isLogin = AsyncHandler(async (req, res, next) => {
  const headerObj = req.headers;

  if (!headerObj.authorization) {
    const error = new Error("Token inválido e/ou expirado ");
    error.statusCode = 401;
    throw error;
  }

  const token = headerObj.authorization.split(" ")[1];

  const { id } = verifyToken(token);

  // Verificando se o token enviado na requisição pertence a algum usuário
  const verifiedIfExistUserWithThisToken = await User.findByPk(id);

  if (!verifiedIfExistUserWithThisToken) {
    const err = new Error("Token inválido e/ou expirado");
    next(err);
  }

  if (id) {
    const user = await User.findOne({
      where: { id },
      attributes: ["id", "username", "email"],
    });

    req.userAuth = user;
    next();
  } else {
    const err = new Error("Token inválido e/ou expirado");
    next(err);
  }
});

module.exports = isLogin;
