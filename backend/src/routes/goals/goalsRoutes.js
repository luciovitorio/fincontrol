const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const {
  storeGoalController,
  indexGoalController,
  showGoalController,
  updateGoalController,
  destroyGoalController,
} = require("../../controllers/goalController");
const {
  validateCreateGoal,
} = require("../../middlewares/validations/goals/validateCreateGoal");
const {
  validateUpdateGoal,
} = require("../../middlewares/validations/goals/validateUpdateGoal");

const goalsRouter = express.Router();

// Store
goalsRouter.post("/", isLogin, validateCreateGoal, storeGoalController);

// Index
goalsRouter.get("/", isLogin, indexGoalController);

// Show
goalsRouter.get("/:id", isLogin, showGoalController);

// Update
goalsRouter.put("/:id", isLogin, validateUpdateGoal, updateGoalController);

// Destroy
goalsRouter.delete("/:id", isLogin, destroyGoalController);

module.exports = goalsRouter;
