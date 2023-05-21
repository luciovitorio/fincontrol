const { Account } = require("../../models");

async function addAmountToAccount(accountId, amount) {
  const account = await Account.findByPk(accountId);

  if (!account) {
    throw new Error("Conta inexistente");
  }

  const parsedAmount = parseFloat(amount);

  if (isNaN(parsedAmount)) {
    throw new Error("Valor inválido");
  }

  if (parsedAmount >= 0) {
    account.balance += parsedAmount;
  } else {
    account.balance -= Math.abs(parsedAmount);
  }

  await account.save();
}
module.exports = addAmountToAccount;
