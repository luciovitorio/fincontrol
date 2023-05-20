const AsyncHandler = require("express-async-handler");
const {
  Account,
  RecurringBill,
  CreditCard,
  Installment,
} = require("../models");

/**
 * @desc Store installment
 * @route POST /api/v1/installments
 * @access Private
 */
exports.storeInstallmentController = AsyncHandler(async (req, res) => {
  const {
    cardId,
    description,
    totalAmount,
    numInstallments,
    dateOfPurchase,
    dueDate,
  } = req.body;

  // Verificando se cartão existe
  const card = await CreditCard.findByPk(cardId);

  if (!card) {
    const error = new Error("Cartão de crédito não encontrado");
    error.statusCode = 404;
    throw error;
  }

  await Installment.create({
    cardId,
    description,
    totalAmount,
    numInstallments,
    dateOfPurchase,
    dueDate,
  });

  res.status(201).json({
    status: "success",
    message: "Prestação registrada com sucesso",
  });
});

/**
 * @desc Index installment
 * @route GET /api/v1/installments
 * @access Private
 */
exports.indexInstallmentController = AsyncHandler(async (req, res) => {
  const installments = await Installment.findAll({
    attributes: [
      "id",
      "description",
      "totalAmount",
      "numInstallments",
      "paidInstallments",
      "dateOfPurchase",
      "dueDate",
    ],
    include: {
      model: CreditCard,
      attributes: ["alias", "flag", "number"],
    },
    order: [["createdAt", "DESC"]],
  });

  return res.json({
    data: installments,
  });
});

/**
 * @desc Show installment
 * @route GET /api/v1/installments/:id
 * @access Private
 */
exports.showInstallmentController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const installment = await Installment.findOne({
    where: { id },
    attributes: [
      "id",
      "description",
      "totalAmount",
      "numInstallments",
      "paidInstallments",
      "dateOfPurchase",
      "dueDate",
    ],
    include: {
      model: CreditCard,
      attributes: ["alias", "flag", "number"],
    },
  });

  // Verificando se o id é um id válido
  if (!installment) {
    const error = new Error("Dados da prestação não encontrada encontrada");
    error.statusCode = 404;
    throw error;
  }

  return res.json({
    data: installment,
  });
});

/**
 * @desc Update installment
 * @route GET /api/v1/installments/:id
 * @access Private
 */
exports.updateInstallmentController = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    description,
    totalAmount,
    numInstallments,
    dateOfPurchase,
    dueDate,
    paidInstallments,
  } = req.body;

  const verifyIfInstallmentExists = await Installment.findByPk(id);

  // Verificando se o id é um id válido
  if (!verifyIfInstallmentExists) {
    const error = new Error("Prestação não encontrada");
    error.statusCode = 404;
    throw error;
  }

  // Verificando se o número de parcelas pagas é maior que o número de parcelas
  if (paidInstallments > verifyIfInstallmentExists.numInstallments) {
    const error = new Error(
      "O número de parcelas pagas é maior que o número de parcelas registrado"
    );
    error.statusCode = 409;
    throw error;
  }

  await Installment.update(
    {
      description,
      totalAmount,
      numInstallments,
      paidInstallments,
      dateOfPurchase,
      dueDate,
    },
    {
      where: { id },
      returning: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Parcela alterada com sucesso",
  });
});

/**
 * @desc Destroy installment
 * @route GET /api/v1/installments/:id
 * @access Private
 */
exports.destroyInstallmentController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const installment = await Installment.findByPk(id);

  // Verificando se o id é um id válido
  if (!installment) {
    const error = new Error("Parcela não encontrada");
    error.statusCode = 404;
    throw error;
  }

  await installment.destroy();

  res.status(200).json({
    status: "success",
    message: "Registro excluído com sucesso",
  });
});
