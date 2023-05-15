const express = require("express");
const {
  storeUserController,
  indexUserController,
  showUserController,
  updateUserController,
  destroyUserController,
} = require("../../controllers/userController");
const {
  validateCreateUser,
} = require("../../middlewares/validations/validateCreateUser");
const isLogin = require("../../middlewares/isLogin");
const {
  validateUpdateUser,
} = require("../../middlewares/validations/validateUpdateUser");
// const isAdmin = require("../../middlewares/isAdmin");
// const { validateUpdateUser } = require("../../middlewares/validateUpdateUser");
const userRouter = express.Router();

// Store
userRouter.post("/", isLogin, validateCreateUser, storeUserController);

// Index
userRouter.get("/", isLogin, indexUserController);

// Show
userRouter.get("/:id", isLogin, showUserController);

// Update
userRouter.put("/:id", isLogin, validateUpdateUser, updateUserController);

// Destroy
userRouter.delete("/:id", isLogin, destroyUserController);

module.exports = userRouter;
