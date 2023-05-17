const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const AsyncHandler = require("express-async-handler");

const prisma = new PrismaClient();

/**
 * @desc Store category
 * @route POST /api/v1/categories
 * @access Private
 */
exports.storeCategoryController = AsyncHandler(async (req, res) => {
  const { name } = req.body;

  // Verificando se o nome da categoria ja existe
  const category = await prisma.category.findFirst({
    where: { name },
  });

  if (category) {
    const error = new Error("Categoria já cadastrada com esse nome");
    error.statusCode = 409;
    throw error;
  }

  const newRegister = await prisma.register.create({
    data: {
      userId: req.userAuth.id,
      dateOper: new Date(),
      type: "insert",
    },
  });

  const newCategory = await prisma.category.create({
    data: {
      name,
      registerId: newRegister.id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  res.status(201).json({
    status: "success",
    message: "Categoria criada com sucesso",
    data: newCategory,
  });

  await prisma.$disconnect();
});

/**
 * @desc Index categories
 * @route GET /api/v1/categories
 * @access Private
 */
exports.indexCategoryController = AsyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  await prisma.$disconnect();

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

  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Verificando se o id é um id válido
  if (!category) {
    const error = new Error("Categoria não encontrada");
    error.statusCode = 404;
    throw error;
  }

  await prisma.$disconnect();

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

  const verifyIfCategoryExists = await prisma.category.findUnique({
    where: { id },
  });

  // Verificando se o id é um id válido
  if (!verifyIfCategoryExists) {
    const error = new Error("Categoria não encontrada");
    error.statusCode = 404;
    throw error;
  }

  // Verificando se o nome de usuário já existe.
  if (!name) {
    const error = new Error("Nome da categoria é obrigatório");
    error.statusCode = 404;
    throw error;
  }

  const verifyIfCategoryExist = await prisma.category.findFirst({
    where: {
      name,
      NOT: {
        id,
      },
    },
  });

  if (verifyIfCategoryExist) {
    const error = new Error("Já existe uma categoria com esse nome");
    error.statusCode = 409;
    throw error;
  }

  const newRegister = await prisma.register.create({
    data: {
      userId: req.userAuth.id,
      dateOper: new Date(),
      type: "alter",
    },
  });

  await prisma.category.update({
    where: { id },
    data: {
      name,
      registerId: newRegister.id,
    },
  });

  res.status(200).json({
    status: "success",
    message: "Categoria alterada com sucesso",
  });

  await prisma.$disconnect();
});

/**
 * @desc Destroy category
 * @route GET /api/v1/categories/:id
 * @access Private
 */
exports.destroyCategoryController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  // Verificando se o id é um id válido
  if (!category) {
    const error = new Error("Categoria não encontrada");
    error.statusCode = 404;
    throw error;
  }

  await prisma.category.delete({
    where: { id },
  });

  res.status(200).json({
    status: "success",
    message: "Registro excluído com sucesso",
  });

  await prisma.$disconnect();
});
