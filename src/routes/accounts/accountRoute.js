const express = require("express");
const {
  storeAccountController,
  indexAccountController,
  showAccountController,
  updateAccountController,
  destroyAccountController,
  includeAccountController,
} = require("../../controllers/accountController");

const isLogin = require("../../middlewares/isLogin");
const {
  validateCreateAccount,
} = require("../../middlewares/validations/accounts/validateCreateAccount");
const {
  validateUpdateAccount,
} = require("../../middlewares/validations/accounts/validateUpdateAccount");
const {
  validateIncludeUserAccount,
} = require("../../middlewares/validations/accounts/validateIncludeUserAccount");

const accountRouter = express.Router();

// Store
accountRouter.post("/", isLogin, validateCreateAccount, storeAccountController);

// Index
accountRouter.get("/", isLogin, indexAccountController);

// Show
accountRouter.get("/:id", isLogin, showAccountController);

// Update
accountRouter.put(
  "/:id",
  isLogin,
  validateUpdateAccount,
  updateAccountController
);

// Include User
accountRouter.put(
  "/include/:id",
  isLogin,
  validateIncludeUserAccount,
  includeAccountController
);

// Destroy
accountRouter.delete("/:id", isLogin, destroyAccountController);

module.exports = accountRouter;
