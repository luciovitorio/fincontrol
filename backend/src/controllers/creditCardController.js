const AsyncHandler = require("express-async-handler");
const { CreditCard, Account } = require("../models");
const removeSpacesCC = require("../utils/removeSpacesCC");
const { Op } = require("sequelize");

/**
 * @desc Store creditCard
 * @route POST /api/v1/credit-cards
 * @access Private
 */
exports.storeCreditCardController = AsyncHandler(async (req, res) => {
  const { accountId, alias, flag, number, dueDate, expirationDate, limit } =
    req.body;

  // Convertendo o número do cartão de 1111 1111 1111 1111 para 111111111111
  const formatedCardNumber = removeSpacesCC(number);

  // Verificando se ja existe um cartão com o mesmo número
  const card = await CreditCard.findOne({
    where: { number: formatedCardNumber },
  });

  if (card) {
    const error = new Error("Cartão de crédito já cadastrado com esse número");
    error.statusCode = 409;
    throw error;
  }

  // Verificando se a conta existe
  const account = await Account.findByPk(accountId);

  if (!account) {
    const error = new Error("Conta não cadastrada");
    error.statusCode = 404;
    throw error;
  }

  await CreditCard.create({
    accountId,
    alias,
    flag,
    number: formatedCardNumber,
    dueDate,
    expirationDate,
    limit,
  });

  res.status(201).json({
    status: "success",
    message: "Cartão de crédito cadastrado com sucesso",
  });
});

/**
 * @desc Index credit cards
 * @route GET /api/v1/credit-cards
 * @access Private
 */
exports.indexCreditCardController = AsyncHandler(async (req, res) => {
  const cards = await CreditCard.findAll({
    attributes: [
      "id",
      "alias",
      "flag",
      "number",
      "dueDate",
      "expirationDate",
      "limit",
    ],
    include: {
      model: Account,
      attributes: ["number", "type", "balance"],
    },
    order: [["createdAt", "DESC"]],
  });

  const formattedCards = cards.map((card) => card.toJSON());

  return res.json({
    data: formattedCards,
  });
});

/**
 * @desc Show credit card
 * @route GET /api/v1/credit-cards/:id
 * @access Private
 */
exports.showCreditCardController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const card = await CreditCard.findOne({
    where: { id },
    attributes: [
      "alias",
      "flag",
      "number",
      "dueDate",
      "expirationDate",
      "limit",
    ],
    include: {
      model: Account,
      attributes: ["number", "type", "balance"],
    },
  });

  // Verificando se o id é de um cartão que existe
  if (!card) {
    const error = new Error("Cartão de crédito não encontrado");
    error.statusCode = 404;
    throw error;
  }

  return res.json({
    data: card,
  });
});

/**
 * @desc Update credit card
 * @route PUT /api/v1/credit-cards/:id
 * @access Private
 */
exports.updateCreditCardController = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { alias, flag, number, dueDate, expirationDate, limit } = req.body;

  // Convertendo o número do cartão de 1111 1111 1111 1111 para 111111111111
  const formatedCardNumber = removeSpacesCC(number);

  const verifyIfCreditCardExists = await CreditCard.findByPk(id);
  const cardData = verifyIfCreditCardExists;

  // Verificando se o id é um id válido
  if (!verifyIfCreditCardExists) {
    const error = new Error("Cartão de crédito não encontrado");
    error.statusCode = 404;
    throw error;
  }

  // Verificando se ja existe um cartão com o mesmo número
  const card = await CreditCard.findOne({
    where: {
      number: formatedCardNumber,
      id: {
        [Op.ne]: cardData.dataValues.id,
      },
    },
  });

  if (card) {
    const error = new Error("Cartão de crédito já cadastrado com esse número");
    error.statusCode = 409;
    throw error;
  }

  await CreditCard.update(
    {
      alias,
      flag,
      number: formatedCardNumber,
      dueDate,
      expirationDate,
      limit,
    },
    {
      where: { id },
      returning: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Cartão de crédito alterado com sucesso",
  });
});

/**
 * @desc Destroy creditCard
 * @route GET /api/v1/credit-cards/:id
 * @access Private
 */
exports.destroyCreditCardController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const card = await CreditCard.findByPk(id);

  // Verificando se o id é um id válido
  if (!card) {
    const error = new Error("Cartão de crédito não encontrado");
    error.statusCode = 404;
    throw error;
  }

  await card.destroy();

  res.status(200).json({
    status: "success",
    message: "Registro excluído com sucesso",
  });
});
