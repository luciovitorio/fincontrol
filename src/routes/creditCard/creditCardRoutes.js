const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const {
  storeCreditCardController,
  indexCreditCardController,
  showCreditCardController,
  updateCreditCardController,
  destroyCreditCardController,
} = require("../../controllers/creditCardController");
const {
  validateCreateCreditCard,
} = require("../../middlewares/validations/creditCards/validateCreateCreditCard");
const {
  validateUpdateCreditCard,
} = require("../../middlewares/validations/creditCards/validateUpdateCreditCard");

const creditCardRouter = express.Router();

// Store
creditCardRouter.post(
  "/",
  isLogin,
  validateCreateCreditCard,
  storeCreditCardController
);

// Index
creditCardRouter.get("/", isLogin, indexCreditCardController);

// Show
creditCardRouter.get("/:id", isLogin, showCreditCardController);

// Update
creditCardRouter.put(
  "/:id",
  isLogin,
  validateUpdateCreditCard,
  updateCreditCardController
);

// Destroy
creditCardRouter.delete("/:id", isLogin, destroyCreditCardController);

module.exports = creditCardRouter;
