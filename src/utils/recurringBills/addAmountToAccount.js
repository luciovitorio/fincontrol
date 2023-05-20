const { Account } = require("../../models");

async function addAmountToAccount(accountId, amount) {
  const account = await Account.findByPk(accountId);

  console.log("antes do parse:", amount);

  if (!account) {
    throw new Error("Conta inexistente");
  }

  const parsedAmount = parseFloat(amount);

  if (isNaN(parsedAmount)) {
    throw new Error("Valor inválido");
  }

  console.log("depois do parse:", parsedAmount);

  if (parsedAmount >= 0) {
    account.balance += parsedAmount;
  } else {
    account.balance -= Math.abs(parsedAmount);
  }

  await account.save();

  console.log(account.toJSON());
}
module.exports = addAmountToAccount;
