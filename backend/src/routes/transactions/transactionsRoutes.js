const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const {
  storeTransactionController,
  indexTransactionController,
  showTransactionController,
  updateTransactionController,
  destroyTransactionController,
} = require("../../controllers/transactionController");
const {
  validateCreateTransaction,
} = require("../../middlewares/validations/transactions/validateCreateTransaction");
const {
  validateUpdateTransaction,
} = require("../../middlewares/validations/transactions/validateUpdateTransaction");

const transactionRouter = express.Router();

// Store
transactionRouter.post(
  "/",
  isLogin,
  validateCreateTransaction,
  storeTransactionController
);

// Index
transactionRouter.get("/", isLogin, indexTransactionController);

// Show
transactionRouter.get("/:id", isLogin, showTransactionController);

// Update
transactionRouter.put(
  "/:id",
  isLogin,
  validateUpdateTransaction,
  updateTransactionController
);

// Destroy
transactionRouter.delete("/:id", isLogin, destroyTransactionController);

module.exports = transactionRouter;
