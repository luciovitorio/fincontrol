const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const AsyncHandler = require("express-async-handler");

const prisma = new PrismaClient();

/**
 * @desc Store user
 * @route POST /api/v1/users
 * @access Private
 */
exports.storeUserController = AsyncHandler(async (req, res) => {
  const { username, password, password_confirmation, email } = req.body;

  // Verificando se o nome de usuário ja existe
  const user = await prisma.user.findFirst({
    where: { username },
  });

  if (user) {
    const error = new Error("Usuário já cadastrado com esse nome");
    error.statusCode = 409;
    throw error;
  }

  // Verificando se já possui um email cadastrado
  const emailExists = await prisma.user.findFirst({
    where: { email },
  });

  if (emailExists) {
    const error = new Error("Já existe um usuário cadastrado com esse email");
    error.statusCode = 409;
    throw error;
  }

  // Verificando se a senha e a confirmação de senha são iguais
  if (password !== password_confirmation) {
    const error = new Error("As senhas não conferem");
    error.statusCode = 400;
    throw error;
  }

  // Criptografando a senha
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      email,
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  res.status(201).json({
    status: "success",
    message: "Usuário criado com sucesso",
    data: newUser,
  });

  await prisma.$disconnect();
});

/**
 * @desc Index users
 * @route GET /api/v1/users
 * @access Private
 */
exports.indexUserController = AsyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  await prisma.$disconnect();

  return res.json({
    data: users,
  });
});

/**
 * @desc Show user
 * @route GET /api/v1/users/:id
 * @access Private
 */
exports.showUserController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Verificando se o id é um id válido
  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  await prisma.$disconnect();

  return res.json({
    data: user,
  });
});

/**
 * @desc Update user
 * @route GET /api/v1/users/:id
 * @access Private
 */
exports.updateUserController = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, password, password_confirmation, email } = req.body;

  const verifyIfUserExists = await prisma.user.findUnique({
    where: { id },
  });

  // Verificando se o id é um id válido
  if (!verifyIfUserExists) {
    const error = new Error("Usuário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  // Verificando se já existe um usuario com o email
  if (email) {
    const verifyIfEmailExist = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id,
        },
      },
    });

    if (verifyIfEmailExist) {
      const error = new Error("Já existe um usuário com esse email");
      error.statusCode = 409;
      throw error;
    }
  }

  // Verificando se o usuário enviou a senha para alterar
  if (password && password !== password_confirmation) {
    const error = new Error("As senhas não conferem");
    error.statusCode = 400;
    throw error;
  }

  let hashedPassword;

  // Verificando se o usuario enviou a senha para atualizar e criptografando ela
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  // Verificando se o nome de usuário já existe.
  if (!username) {
    const error = new Error("Nome de usuário obrigatório");
    error.statusCode = 404;
    throw error;
  }

  const verifyIfUsernameExist = await prisma.user.findFirst({
    where: {
      username,
      NOT: {
        id,
      },
    },
  });

  if (verifyIfUsernameExist) {
    const error = new Error("Já existe um usuário com esse nome");
    error.statusCode = 409;
    throw error;
  }

  await prisma.user.update({
    where: { id },
    data: {
      username,
      password: hashedPassword,
      email: email ? email : null,
    },
  });

  res.status(200).json({
    status: "success",
    message: "Usuário alterado com sucesso",
  });

  await prisma.$disconnect();
});

/**
 * @desc Destroy user
 * @route GET /api/v1/users/:id
 * @access Private
 */
exports.destroyUserController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  // Verificando se o id é um id válido
  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  await prisma.user.delete({
    where: { id },
  });

  res.status(200).json({
    status: "success",
    message: "Registro excluído com sucesso",
  });

  await prisma.$disconnect();
});
