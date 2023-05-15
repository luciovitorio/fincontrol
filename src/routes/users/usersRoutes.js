const express = require("express");
const {
  storeUserController,
  // indexUserController,
  // showUserController,
  // updateUserController,
  // destroyUserController,
} = require("../../controllers/userController");
// const { validateCreateUser } = require("../../middlewares/validateCreateUser");
// const isLogin = require("../../middlewares/isLogin");
// const isAdmin = require("../../middlewares/isAdmin");
// const { validateUpdateUser } = require("../../middlewares/validateUpdateUser");
const userRouter = express.Router();

// Store
userRouter.post("/", storeUserController);

// Index
// userRouter.get("/", isLogin, isAdmin, indexUserController);

// Show
// userRouter.get("/:id", isLogin, isAdmin, showUserController);

// Update
// userRouter.put(
//   "/:id",
//   isLogin,
//   isAdmin,
//   validateUpdateUser,
//   updateUserController
// );

// Destroy
// userRouter.delete("/:id", isLogin, isAdmin, destroyUserController);

module.exports = userRouter;
