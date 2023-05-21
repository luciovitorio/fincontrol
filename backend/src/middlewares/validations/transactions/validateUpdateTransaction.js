const Joi = require("joi");

exports.validateUpdateTransaction = (req, res, next) => {
  const schema = Joi.object({
    categoryId: Joi.string().uuid().allow(null).messages({
      "string.base": "O campo categoria deve ser um texto",
      "string.uuid": "O campo categoria deve ser um UUID válido",
    }),
    accountId: Joi.string().uuid().allow(null).messages({
      "string.base": "O campo conta deve ser um texto",
      "string.uuid": "O campo conta deve ser um UUID válido",
    }),
    goalId: Joi.string().uuid().allow(null).messages({
      "string.base": "O campo objetivo deve ser um texto",
      "string.uuid": "O campo objetivo deve ser um UUID válido",
    }),
    cardId: Joi.string().uuid().allow(null).messages({
      "string.base": "O campo cartão de crédito deve ser um texto",
      "string.uuid": "O campo cartão de crédito deve ser um UUID válido",
    }),
    installmentId: Joi.string().allow(null).uuid().messages({
      "string.base": "O campo parcela deve ser um texto",
      "string.uuid": "O campo parcela deve ser um UUID válido",
    }),
    amount: Joi.number().min(0).required().messages({
      "any.required": "O campo valor é obrigatório",
      "number.min": "O campo valor deve ser maior ou igual a 0",
    }),
    entryType: Joi.string().required().valid("CREDIT", "DEBIT").messages({
      "string.base": "O campo tipo de registro deve ser um texto",
      "any.required": "O campo tipo de registro é obrigatório",
      "any.only": "O campo tipo de registro deve ser ENTRADA ou SAÍDA",
    }),
    paymentType: Joi.string()
      .required()
      .valid("CREDITCARD", "PIX", "DEBITCARD", "MONEY")
      .messages({
        "string.base": "O campo forma de entrada/saída deve ser um texto",
        "any.required": "O campo forma de entrada/saída é obrigatório",
        "any.only":
          "O campo forma de entrada/saída deve ser CARTÃO DE CRÉDITO, PIX, CARTÃO DE DÉBITO ou DINHEIRO",
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.reduce((acc, detail) => {
      const { message, context } = detail;
      const { label } = context;
      return {
        ...acc,
        [label]: message,
      };
    }, {});

    return res.status(400).json({
      errors: errorMessages,
    });
  }

  return next();
};
