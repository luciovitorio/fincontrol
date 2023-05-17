const { Category } = require("../models");

const AsyncHandler = require("express-async-handler");
const createLogEntry = require("../utils/createLogEntry");
const { Op } = require("sequelize");

/**
 * @desc Store category
 * @route POST /api/v1/categories
 * @access Private
 */
exports.storeCategoryController = AsyncHandler(async (req, res) => {
  const { name } = req.body;

  // Verificando se o nome da categoria ja existe
  const category = await Category.findOne({
    where: { name },
  });

  if (category) {
    const error = new Error("Categoria já cadastrada com esse nome");
    error.statusCode = 409;
    throw error;
  }

  // Gerando Log
  const categoryData = req.body;

  const logData = {
    userId: req.userAuth.id,
    type: "CREATE",
    metadata: categoryData,
    table: "Categories",
  };

  const newLog = await createLogEntry(logData);

  await Category.create({
    name,
    logId: newLog.id,
  });

  res.status(201).json({
    status: "success",
    message: "Categoria criada com sucesso",
  });
});

/**
 * @desc Index categories
 * @route GET /api/v1/categories
 * @access Private
 */
exports.indexCategoryController = AsyncHandler(async (req, res) => {
  const categories = await Category.findAll({
    attributes: ["id", "name"],
    order: [["createdAt", "DESC"]],
  });

  return res.json({
    data: categories,
  });
});

/**
 * @desc Show category
 * @route GET /api/v1/categories/:id
 * @access Private
 */
exports.showCategoryController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findOne({
    where: { id },
    attributes: ["id", "name"],
  });

  // Verificando se o id é um id válido
  if (!category) {
    const error = new Error("Categoria não encontrada");
    error.statusCode = 404;
    throw error;
  }

  return res.json({
    data: category,
  });
});

/**
 * @desc Update category
 * @route GET /api/v1/categories/:id
 * @access Private
 */
exports.updateCategoryController = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const verifyIfCategoryExists = await Category.findByPk(id);

  // Verificando se o id é um id válido
  if (!verifyIfCategoryExists) {
    const error = new Error("Categoria não encontrada");
    error.statusCode = 404;
    throw error;
  }

  const oldCategory = verifyIfCategoryExists;

  // Verificando se o nome de usuário já existe.
  if (!name) {
    const error = new Error("Nome da categoria é obrigatório");
    error.statusCode = 404;
    throw error;
  }

  const verifyIfCategoryNameExist = await Category.findOne({
    where: {
      name,
      id: {
        [Op.ne]: oldCategory.dataValues.id,
      },
    },
  });

  if (verifyIfCategoryNameExist) {
    const error = new Error("Já existe uma categoria com esse nome");
    error.statusCode = 409;
    throw error;
  }

  // Gerando Log
  const categoryData = req.body;

  const logData = {
    userId: req.userAuth.id,
    type: "UPDATE",
    metadata: categoryData,
    table: "Categories",
  };

  const newLog = await createLogEntry(logData);

  await Category.update(
    {
      name,
      logId: newLog.id,
    },
    {
      where: { id },
    }
  );

  res.status(200).json({
    status: "success",
    message: "Categoria alterada com sucesso",
  });
});

/**
 * @desc Destroy category
 * @route GET /api/v1/categories/:id
 * @access Private
 */
exports.destroyCategoryController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByPk(id);

  // Verificando se o id é um id válido
  if (!category) {
    const error = new Error("Categoria não encontrada");
    error.statusCode = 404;
    throw error;
  }

  // Gerando Log
  const categoryData = req.body;

  const logData = {
    userId: req.userAuth.id,
    type: "DELETE",
    metadata: categoryData,
    table: "Categories",
  };

  await createLogEntry(logData);

  await category.destroy();

  res.status(200).json({
    status: "success",
    message: "Registro excluído com sucesso",
  });
});
