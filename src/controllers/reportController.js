const { User, Account } = require("../models");
const AsyncHandler = require("express-async-handler");

/**
 * @desc Store user
 * @route POST /api/v1/users
 * @access Private
 */
exports.reportAccountWithoutUserController = AsyncHandler(async (req, res) => {
  const usersWithoutAccount = await User.findAll({
    where: {
      "$Accounts.id$": null,
    },
    include: [
      {
        model: Account,
        as: "Accounts",
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
