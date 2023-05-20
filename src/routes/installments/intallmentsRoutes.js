const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const {
  storeInstallmentController,
  indexInstallmentController,
  showInstallmentController,
  updateInstallmentController,
  destroyInstallmentController,
} = require("../../controllers/installmentController");
const {
  validateCreateInstallment,
} = require("../../middlewares/validations/installments/validateCreateInstallment");
const {
  validateUpdateInstallment,
} = require("../../middlewares/validations/installments/validateUpdateInstallment");

const installmentsRouter = express.Router();

// Store
installmentsRouter.post(
  "/",
  isLogin,
  validateCreateInstallment,
  storeInstallmentController
);

// Index
installmentsRouter.get("/", isLogin, indexInstallmentController);

// Show
installmentsRouter.get("/:id", isLogin, showInstallmentController);

// Update
installmentsRouter.put(
  "/:id",
  isLogin,
  validateUpdateInstallment,
  updateInstallmentController
);

// Destroy
installmentsRouter.delete("/:id", isLogin, destroyInstallmentController);

module.exports = installmentsRouter;
