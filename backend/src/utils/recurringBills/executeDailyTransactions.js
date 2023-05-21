const { Op } = require("sequelize");
const addAmountToAccount = require("./addAmountToAccount");
const { RecurringBill } = require("../../models");

async function executeDailyTransactions() {
  const currentDate = new Date();

  const recurringBills = await RecurringBill.findAll({
    where: {
      period: "DAILY",
      [Op.or]: [
        { finishedDate: { [Op.gte]: currentDate } },
        { finishedDate: null },
      ],
    },
  });

  for (const bill of recurringBills) {
    const { accountId, amount, entryType } = bill;

    console.log(entryType);

    if (entryType === "CREDIT") {
      await addAmountToAccount(accountId, amount);
    } else if (entryType === "DEBIT") {
      await addAmountToAccount(accountId, -amount);
    }
  }
}

executeDailyTransactions();
