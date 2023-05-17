const express = require("express");
const {
  storeCategoryController,
  indexCategoryController,
  showCategoryController,
  updateCategoryController,
  destroyCategoryController,
} = require("../../controllers/categoryController");

const isLogin = require("../../middlewares/isLogin");
const {
  validateCreateCategory,
} = require("../../middlewares/validations/categories/validateCreateCategory");
const {
  validateUpdateCategory,
} = require("../../middlewares/validations/categories/validateUpdateCategory");

const categoryRouter = express.Router();

// Store
categoryRouter.post(
  "/",
  isLogin,
  validateCreateCategory,
  storeCategoryController
);

// Index
categoryRouter.get("/", isLogin, indexCategoryController);

// Show
categoryRouter.get("/:id", isLogin, showCategoryController);

// Update
categoryRouter.put(
  "/:id",
  isLogin,
  validateUpdateCategory,
  updateCategoryController
);

// Destroy
categoryRouter.delete("/:id", isLogin, destroyCategoryController);

module.exports = categoryRouter;
