const AsyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const verifyToken = require("../utils/verifyToken");

const prisma = new PrismaClient();

const isLogin = AsyncHandler(async (req, res, next) => {
  const headerObj = req.headers;

  if (!headerObj.authorization) {
    const error = new Error("Token inválido e/ou expirado ");
    error.statusCode = 401;
    throw error;
  }

  const token = headerObj.authorization.split(" ")[1];

  const verifiedToken = verifyToken(token);

  // Verificando se o token enviado na requisição pertence a algum usuário
  const verifiedIfExistUserWithThisToken = await User.findByPk(
    verifiedToken.id
  );

  if (!verifiedIfExistUserWithThisToken) {
    const err = new Error("Token inválido e/ou expirado");
    next(err);
  }

  if (verifiedToken) {
    const user = await User.findOne({
      where: { id: verifiedToken.id },
      attributes: [
        "id",
        "name",
        "document",
        "isActive",
        "email",
        "dtBorn",
        "role",
      ],
    });
    req.userAuth = user;
    next();
  } else {
    const err = new Error("Token inválido e/ou expirado");
    next(err);
  }
});

module.exports = isLogin;
