const { User, Account } = require("../models");
const AsyncHandler = require("express-async-handler");

/**
 * @desc Retornar as contas sem usuários associados
 * @route POST /api/v1/reports/account-without-user
 * @access Private
 */
exports.reportAccountWithoutUserController = AsyncHandler(async (req, res) => {
  const accountWithoutUsers = await Account.findAll({
    where: {
      "$Users.id$": null,
    },
    include: [
      {
        model: User,
        as: "Users",
        required: false,
      },
    ],
    attributes: ["id", "number", "type", "balance"],
  });

  res.status(200).json({
    status: "success",
    data: accountWithoutUsers,
  });
});

/**
 * @desc Retornar usuários sem uma conta associada
 * @route POST /api/v1/reports/user-without-account
 * @access Private
 */
exports.reportUserWithoutAccountController = AsyncHandler(async (req, res) => {
  const usersWithoutAccount = await User.findAll({
    where: {
      "$Accounts.id$": null,
    },
    include: [
      {
        model: Account,
        required: false,
      },
    ],
    attributes: ["username", "email"],
  });

  res.status(200).json({
    status: "success",
    data: usersWithoutAccount,
  });
});
