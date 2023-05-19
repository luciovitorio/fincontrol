const AsyncHandler = require("express-async-handler");
const { User, Account, AccountUser } = require("../models");
const { Op } = require("sequelize");

/**
 * @desc Store account
 * @route POST /api/v1/accounts
 * @access Private
 */
exports.storeAccountController = AsyncHandler(async (req, res) => {
  const { userId, number, type, balance } = req.body;

  // Verificando se o id do usuario foi enviado e se existe

  if (!userId) {
    const error = new Error("Favor associar um usuário a conta");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  // Verificando se já possui uma conta cadastrada com esse número
  const accountNumberExists = await Account.findOne({
    where: { number },
  });

  if (accountNumberExists) {
    const error = new Error("Já existe uma conta cadastrada com esse número");
    error.statusCode = 409;
    throw error;
  }

  const newAccount = await Account.create({
    userId,
    number,
    type,
    balance,
  });

  await user.addAccount(newAccount);

  res.status(201).json({
    status: "success",
    message: "Conta criada com sucesso",
    data: newAccount,
  });
});

/**
 * @desc Index accounts
 * @route GET /api/v1/accounts
 * @access Private
 */
exports.indexAccountController = AsyncHandler(async (req, res) => {
  const accounts = await Account.findAll({
    attributes: ["id", "number", "type", "balance"],
    order: [["createdAt", "DESC"]],
    include: {
      model: User,
      attributes: ["username", "email"],
      through: { attributes: [] },
    },
  });

  return res.json({
    data: accounts,
  });
});

/**
 * @desc Show account
 * @route GET /api/v1/accounts/:id
 * @access Private
 */
exports.showAccountController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const account = await Account.findOne({
    where: { id },
    attributes: ["number", "type", "balance"],
  });

  // Verificando se o id é um id válido
  if (!account) {
    const error = new Error("Conta não encontrada");
    error.statusCode = 404;
    throw error;
  }

  return res.json({
    data: account,
  });
});

/**
 * @desc Update account
 * @route PUT /api/v1/accounts/:id
 * @access Private
 */
exports.updateAccountController = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { number, type, balance } = req.body;

  const verifyIfAccountExists = await Account.findByPk(id);
  const accountData = verifyIfAccountExists;

  // Verificando se o id é um id válido
  if (!verifyIfAccountExists) {
    const error = new Error("Conta não encontrada");
    error.statusCode = 404;
    throw error;
  }

  // Verificando se já existe um usuario com o email
  if (number) {
    const verifyIfNumberExist = await Account.findOne({
      where: {
        number,
        id: {
          [Op.ne]: accountData.dataValues.id,
        },
      },
    });

    if (verifyIfNumberExist) {
      const error = new Error("Já existe uma conta cadastrada com esse número");
      error.statusCode = 409;
      throw error;
    }
  }

  await Account.update(
    {
      number,
      type,
      balance,
    },
    {
      where: { id },
      returning: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Conta alterada com sucesso",
  });
});

/**
 * @desc Include user in a account
 * @route PUT /api/v1/accounts/include/:id
 * @access Private
 */
exports.includeAccountController = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const verifyIfAccountExists = await Account.findByPk(id);

  // Verificando se o id é um id válido
  if (!verifyIfAccountExists) {
    const error = new Error("Conta não encontrada");
    error.statusCode = 404;
    throw error;
  }

  // Verificando se o userId foi enviado
  if (!userId) {
    const error = new Error("Usuário não enviado para associar essa conta");
    error.statusCode = 404;
    throw error;
  }

  // Verificando se o userId enviado existe no banco
  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error("Usuário não existe para associar essa conta");
    error.statusCode = 404;
    throw error;
  }

  // Verificando se o usuario associado a essa conta é o mesmo que esta sendo enviado
  const isUserAssociated = await AccountUser.findOne({
    where: {
      userId,
      accountId: id,
    },
  });

  if (isUserAssociated) {
    const error = new Error(
      "Esse usuário já se encontra associado a essa conta"
    );
    error.statusCode = 400;
    throw error;
  }

  await AccountUser.create({
    accountId: id,
    userId,
  });

  res.status(200).json({
    status: "success",
    message: "Usuário associado a conta com sucesso",
  });
});

/**
 * @desc Destroy account
 * @route GET /api/v1/accounts/:id
 * @access Private
 */
exports.destroyAccountController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const account = await Account.findByPk(id);

  // Verificando se o id é um id válido
  if (!account) {
    const error = new Error("Conta não encontrada");
    error.statusCode = 404;
    throw error;
  }

  await account.destroy();

  res.status(200).json({
    status: "success",
    message: "Registro excluído com sucesso",
  });
});
