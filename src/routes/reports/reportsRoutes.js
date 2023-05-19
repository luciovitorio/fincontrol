const express = require("express");
const {
  reportAccountWithoutUserController,
} = require("../../controllers/reportController");
const isLogin = require("../../middlewares/isLogin");

const reportRouter = express.Router();

// Store
reportRouter.get(
  "/account-without-user",
  isLogin,
  reportAccountWithoutUserController
);

module.exports = reportRouter;
