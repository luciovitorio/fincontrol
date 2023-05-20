const AsyncHandler = require("express-async-handler");
const { Account, RecurringBill } = require("../models");

/**
 * @desc Store recurringBill
 * @route POST /api/v1/recurring-bills
 * @access Private
 */
exports.storeRecurringBillController = AsyncHandler(async (req, res) => {
  const {
    accountId,
    description,
    amount,
    initialDate,
    finishedDate,
    period,
    entryType,
  } = req.body;

  // Verificando se a conta existe
  const account = await Account.findByPk(accountId);

  if (!account) {
    const error = new Error("Conta inexistente");
    error.statusCode = 404;
    throw error;
  }

  await RecurringBill.create({
    accountId,
    description,
    amount,
    initialDate,
    finishedDate,
    period,
    entryType,
  });

  res.status(201).json({
    status: "success",
    message: "Valor recorrente registrado com sucesso",
  });
});

/**
 * @desc Index recurringBill
 * @route GET /api/v1/recurring-bills
 * @access Private
 */
exports.indexRecurringBillController = AsyncHandler(async (req, res) => {
  const bills = await RecurringBill.findAll({
    attributes: [
      "id",
      "description",
      "amount",
      "initialDate",
      "finishedDate",
      "period",
      "entryType",
    ],
    include: {
      model: Account,
      attributes: ["number", "type", "balance"],
    },
    order: [["createdAt", "DESC"]],
  });

  return res.json({
    data: bills,
  });
});

/**
 * @desc Show recurringBill
 * @route GET /api/v1/recurring-bills/:id
 * @access Private
 */
exports.showRecurringBillController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const bill = await RecurringBill.findOne({
    where: { id },
    attributes: [
      "id",
      "description",
      "amount",
      "initialDate",
      "finishedDate",
      "period",
      "entryType",
    ],
    include: {
      model: Account,
      attributes: ["number", "type", "balance"],
    },
  });

  // Verificando se o id é um id válido
  if (!bill) {
    const error = new Error("Conta recorrente não encontrada");
    error.statusCode = 404;
    throw error;
  }

  return res.json({
    data: bill,
  });
});

/**
 * @desc Update user
 * @route GET /api/v1/users/:id
 * @access Private
 */
exports.updateRecurringBillController = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description, amount, initialDate, finishedDate, period, entryType } =
    req.body;

  const verifyIfBillExists = await RecurringBill.findByPk(id);

  // Verificando se o id é um id válido
  if (!verifyIfBillExists) {
    const error = new Error("Conta recorrente não encontrada");
    error.statusCode = 404;
    throw error;
  }

  await RecurringBill.update(
    {
      description,
      amount,
      initialDate,
      finishedDate,
      period,
      entryType,
    },
    {
      where: { id },
      returning: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Conta recorrente alterada com sucesso",
  });
});

/**
 * @desc Destroy RecurringBill
 * @route GET /api/v1/recurring-bill/:id
 * @access Private
 */
exports.destroyRecurringBillController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const bill = await RecurringBill.findByPk(id);

  // Verificando se o id é um id válido
  if (!bill) {
    const error = new Error("Conta recorrente não encontrada");
    error.statusCode = 404;
    throw error;
  }

  await bill.destroy();

  res.status(200).json({
    status: "success",
    message: "Registro excluído com sucesso",
  });
});
