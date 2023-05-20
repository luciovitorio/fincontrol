const AsyncHandler = require("express-async-handler");
const { CreditCard, Installment, Goal } = require("../models");

/**
 * @desc Store goal
 * @route POST /api/v1/goals
 * @access Private
 */
exports.storeGoalController = AsyncHandler(async (req, res) => {
  const { title, description, amount, currentAmount, startDate, finishedDate } =
    req.body;

  await Goal.create({
    title,
    description,
    amount,
    currentAmount,
    startDate,
    finishedDate,
  });

  res.status(201).json({
    status: "success",
    message: "Objetivo registrado com sucesso",
  });
});

/**
 * @desc Index goal
 * @route GET /api/v1/goals
 * @access Private
 */
exports.indexGoalController = AsyncHandler(async (req, res) => {
  const goals = await Goal.findAll({
    attributes: [
      "id",
      "title",
      "description",
      "amount",
      "currentAmount",
      "startDate",
      "finishedDate",
    ],
    order: [["createdAt", "DESC"]],
  });

  return res.json({
    data: goals,
  });
});

/**
 * @desc Show goal
 * @route GET /api/v1/goals/:id
 * @access Private
 */
exports.showGoalController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const goal = await Goal.findOne({
    where: { id },
    attributes: [
      "id",
      "title",
      "description",
      "amount",
      "currentAmount",
      "startDate",
      "finishedDate",
    ],
  });

  // Verificando se o id é um id válido
  if (!goal) {
    const error = new Error("Objetivo não encontrada encontrado");
    error.statusCode = 404;
    throw error;
  }

  return res.json({
    data: goal,
  });
});

/**
 * @desc Update goal
 * @route GET /api/v1/goals/:id
 * @access Private
 */
exports.updateGoalController = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, amount, currentAmount, startDate, finishedDate } =
    req.body;

  const verifyIfGoalExists = await Goal.findByPk(id);

  // Verificando se o id é um id válido
  if (!verifyIfGoalExists) {
    const error = new Error("Objetivo não encontrado");
    error.statusCode = 404;
    throw error;
  }

  await Goal.update(
    {
      title,
      description,
      amount,
      currentAmount,
      startDate,
      finishedDate,
    },
    {
      where: { id },
      returning: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Objetivo alterado com sucesso",
  });
});

/**
 * @desc Destroy goal
 * @route GET /api/v1/goals/:id
 * @access Private
 */
exports.destroyGoalController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const goal = await Goal.findByPk(id);

  // Verificando se o id é um id válido
  if (!goal) {
    const error = new Error("Objetivo não encontrada");
    error.statusCode = 404;
    throw error;
  }

  await goal.destroy();

  res.status(200).json({
    status: "success",
    message: "Registro excluído com sucesso",
  });
});
