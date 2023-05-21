const express = require("express");
const {
  reportAccountWithoutUserController,
  reportUserWithoutAccountController,
} = require("../../controllers/reportController");
const isLogin = require("../../middlewares/isLogin");

const reportRouter = express.Router();

// Lista as contas sem um usuario associado
reportRouter.get(
  "/account-without-user",
  isLogin,
  reportAccountWithoutUserController
);

// Lista os usuários sem uma conta associada
reportRouter.get(
  "/user-without-account",
  isLogin,
  reportUserWithoutAccountController
);

module.exports = reportRouter;
