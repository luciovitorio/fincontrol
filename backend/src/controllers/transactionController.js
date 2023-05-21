const AsyncHandler = require("express-async-handler");
const {
  CreditCard,
  Installment,
  Category,
  Account,
  Goal,
} = require("../models");
const { Transaction } = require("../models");

/**
 * @desc Store transaction
 * @route POST /api/v1/transactions
 * @access Private
 */
exports.storeTransactionController = AsyncHandler(async (req, res) => {
  const {
    categoryId,
    accountId,
    goalId,
    cardId,
    installmentId,
    amount,
    entryType,
    paymentType,
  } = req.body;

  // Verificando se a categoria foi enviada e se ela existe no banco
  if (categoryId) {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      const error = new Error("Categoria não encontrada");
      error.statusCode = 404;
      throw error;
    }
  }

  // Verificando se o objetivo foi enviado e se ele existe no banco
  if (goalId) {
    const goal = await Goal.findByPk(goalId);

    if (!goal) {
      const error = new Error("Objetivo não encontrado");
      error.statusCode = 404;
      throw error;
    }

    goal.currentAmount += amount;
    await goal.save();
  }

  // Verificando se o cartão foi enviado e se ele existe no banco
  if (cardId) {
    const card = await CreditCard.findByPk(cardId);

    if (!card) {
      const error = new Error("Cartão de crédito não encontrado");
      error.statusCode = 404;
      throw error;
    }

    card.limit -= amount;
    await card.save();
  }

  // Verificando se a parcela foi enviado e se ele existe no banco
  if (installmentId) {
    const installment = await Installment.findByPk(installmentId);

    if (!installment) {
      const error = new Error("Parcela não encontrada");
      error.statusCode = 404;
      throw error;
    }

    installment.paidInstallments += 1;

    // Verificando se o número de parcelas pagas ultrapassa a qtd de parcelas
    if (installment.paidInstallments > installment.numInstallments) {
      const error = new Error("Não existem parcelas a serem pagas");
      error.statusCode = 409;
      throw error;
    }

    await installment.save();
  }

  // Verificando se a conta existe
  const account = await Account.findByPk(accountId);
  if (!account) {
    const error = new Error("Conta não existe");
    error.statusCode = 404;
    throw error;
  }

  if (entryType === "CREDIT") {
    account.balance += amount;
    await account.save();
  } else {
    account.balance -= amount;
    await account.save();
  }

  await Transaction.create({
    categoryId,
    accountId,
    goalId,
    cardId,
    installmentId,
    amount,
    entryType,
    paymentType,
  });

  res.status(201).json({
    status: "success",
    message: "Transação registrada com sucesso",
  });
});

/**
 * @desc Index transaction
 * @route GET /api/v1/transactions
 * @access Private
 */
exports.indexTransactionController = AsyncHandler(async (req, res) => {
  const transactions = await Transaction.findAll({
    attributes: [
      "id",
      "categoryId",
      "accountId",
      "goalId",
      "cardId",
      "installmentId",
      "amount",
      "entryType",
      "paymentType",
    ],
    order: [["createdAt", "DESC"]],
  });

  return res.json({
    data: transactions,
  });
});

/**
 * @desc Show transaction
 * @route GET /api/v1/transactions/:id
 * @access Private
 */
exports.showTransactionController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const transaction = await Transaction.findOne({
    where: { id },
    attributes: [
      "id",
      "categoryId",
      "accountId",
      "goalId",
      "cardId",
      "installmentId",
      "amount",
      "entryType",
      "paymentType",
    ],
  });

  // Verificando se o id é um id válido
  if (!transaction) {
    const error = new Error("Registro de transação não encontrada encontrada");
    error.statusCode = 404;
    throw error;
  }

  return res.json({
    data: transaction,
  });
});

/**
 * @desc Update transaction
 * @route GET /api/v1/transactions/:id
 * @access Private
 */
exports.updateTransactionController = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    categoryId,
    accountId,
    goalId,
    cardId,
    installmentId,
    amount,
    entryType,
    paymentType,
  } = req.body;

  const oldTransaction = await Transaction.findByPk(id);

  // Verificando se o id é um id válido
  if (!oldTransaction) {
    const error = new Error("Registro de transação não encontrada");
    error.statusCode = 404;
    throw error;
  }

  /**
   * A partir daqui eu vou verificar qual o tipo de transação e desfazer a operação no banco
   */
  // Verificando se a categoria foi enviada e se ela existe no banco
  if (oldTransaction.categoryId) {
    const category = await Category.findByPk(oldTransaction.categoryId);

    if (!category) {
      const error = new Error("Categoria não encontrada");
      error.statusCode = 404;
      throw error;
    }
  }

  // Verificando se o objetivo foi enviado e se ele existe no banco
  if (oldTransaction.goalId) {
    const goal = await Goal.findByPk(oldTransaction.goalId);

    if (!goal) {
      const error = new Error("Objetivo não encontrado");
      error.statusCode = 404;
      throw error;
    }

    goal.currentAmount -= oldTransaction.amount;
    await goal.save();
  }

  // Verificando se o cartão foi enviado e se ele existe no banco
  if (oldTransaction.cardId) {
    const card = await CreditCard.findByPk(oldTransaction.cardId);

    if (!card) {
      const error = new Error("Cartão de crédito não encontrado");
      error.statusCode = 404;
      throw error;
    }

    card.limit += oldTransaction.amount;
    await card.save();
  }

  // Verificando se a parcela foi enviado e se ele existe no banco
  if (oldTransaction.installmentId) {
    const installment = await Installment.findByPk(
      oldTransaction.installmentId
    );

    if (!installment) {
      const error = new Error("Parcela não encontrada");
      error.statusCode = 404;
      throw error;
    }

    installment.paidInstallments -= 1;

    await installment.save();
  }

  const account = await Account.findByPk(oldTransaction.accountId);

  if (oldTransaction.entryType === "CREDIT") {
    account.balance -= oldTransaction.amount;
    await account.save();
  } else {
    account.balance += oldTransaction.amount;
    await account.save();
  }

  /**
   * A partir daqui estará sendo feito o processo da alteração
   */

  // Verificando se o objetivo foi enviado e se ele existe no banco
  if (goalId) {
    const goal = await Goal.findByPk(goalId);

    if (!goal) {
      const error = new Error("Objetivo não encontrado");
      error.statusCode = 404;
      throw error;
    }

    goal.currentAmount += amount;
    await goal.save();
  }

  // Verificando se o cartão foi enviado e se ele existe no banco
  if (cardId) {
    const card = await CreditCard.findByPk(cardId);

    if (!card) {
      const error = new Error("Cartão de crédito não encontrado");
      error.statusCode = 404;
      throw error;
    }

    card.limit -= amount;
    await card.save();
  }

  // Verificando se a parcela foi enviado e se ele existe no banco
  if (installmentId) {
    const installment = await Installment.findByPk(installmentId);

    if (!installment) {
      const error = new Error("Parcela não encontrada");
      error.statusCode = 404;
      throw error;
    }

    installment.paidInstallments += 1;

    // Verificando se o número de parcelas pagas ultrapassa a qtd de parcelas
    if (installment.paidInstallments > installment.numInstallments) {
      const error = new Error("Não existem parcelas a serem pagas");
      error.statusCode = 409;
      throw error;
    }

    await installment.save();
  }

  // Verificando se a conta existe
  const newAccount = await Account.findByPk(accountId);
  if (!newAccount) {
    const error = new Error("Conta não existe");
    error.statusCode = 404;
    throw error;
  }

  if (entryType === "CREDIT") {
    account.balance += amount;
    await account.save();
  } else {
    account.balance -= amount;
    await account.save();
  }

  await Installment.update(
    {
      categoryId,
      accountId,
      goalId,
      cardId,
      installmentId,
      amount,
      entryType,
      paymentType,
    },
    {
      where: { id },
      returning: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Registro de transação alterado com sucesso",
  });
});

/**
 * @desc Destroy installment
 * @route GET /api/v1/installments/:id
 * @access Private
 */
exports.destroyTransactionController = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const oldTransaction = await Transaction.findByPk(id);

  // Verificando se o id é um id válido
  if (!oldTransaction) {
    const error = new Error("Registro de transação não encontrada");
    error.statusCode = 404;
    throw error;
  }

  /**
   * A partir daqui eu vou verificar qual o tipo de transação e desfazer a operação no banco
   */

  // Verificando se o objetivo existe no registro
  if (oldTransaction.goalId) {
    const goal = await Goal.findByPk(oldTransaction.goalId);
    goal.currentAmount -= oldTransaction.amount;
    await goal.save();
  }

  // Verificando se o cartão existe no registro
  if (oldTransaction.cardId) {
    const card = await CreditCard.findByPk(oldTransaction.cardId);
    card.limit += oldTransaction.amount;
    await card.save();
  }

  // Verificando se a parcela existe no registro
  if (oldTransaction.installmentId) {
    const installment = await Installment.findByPk(
      oldTransaction.installmentId
    );
    installment.paidInstallments -= 1;

    await installment.save();
  }

  const account = await Account.findByPk(oldTransaction.accountId);

  if (oldTransaction.entryType === "CREDIT") {
    account.balance -= oldTransaction.amount;
    await account.save();
  } else {
    account.balance += oldTransaction.amount;
    await account.save();
  }

  await oldTransaction.destroy();

  res.status(200).json({
    status: "success",
    message: "Registro excluído com sucesso",
  });
});
