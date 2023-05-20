const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const {
  storeRecurringBillController,
  indexRecurringBillController,
  showRecurringBillController,
  updateRecurringBillController,
  destroyRecurringBillController,
} = require("../../controllers/recurringBillController");
const {
  validateCreateRecurringBill,
} = require("../../middlewares/validations/recurringBills/validateCreateRecurringBill");
const {
  validateUpdateRecurringBill,
} = require("../../middlewares/validations/recurringBills/validateUpdateRecurringBill");

const recurringBillRouter = express.Router();

// Store
recurringBillRouter.post(
  "/",
  isLogin,
  validateCreateRecurringBill,
  storeRecurringBillController
);

// Index
recurringBillRouter.get("/", isLogin, indexRecurringBillController);

// Show
recurringBillRouter.get("/:id", isLogin, showRecurringBillController);

// Update
recurringBillRouter.put(
  "/:id",
  isLogin,
  validateUpdateRecurringBill,
  updateRecurringBillController
);

// Destroy
recurringBillRouter.delete("/:id", isLogin, destroyRecurringBillController);

module.exports = recurringBillRouter;
