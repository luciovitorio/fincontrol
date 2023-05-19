const Joi = require("joi");

exports.validateUpdateAccount = (req, res, next) => {
  const schema = Joi.object({
    number: Joi.number().required().integer().positive().messages({
      "number.base": "O campo número da conta deve ser um número",
      "number.integer": "O campo número da conta deve ser um número inteiro",
      "number.positive": "O campo número da conta deve ser um número positivo",
      "any.required": "O campo número da conta é obrigatório",
      "string.max": "O campo número da conta deve ter no máximo 255 caracteres",
    }),
    type: Joi.string().required().valid("CURRENT", "SAVING").messages({
      "any.required": "O campo tipo de conta é obrigatório",
      "string.empty": "O campo campo tipo de conta não pode estar vazio",
      "any.only": "O campo tipo de conta deve ser corrente ou poupança",
    }),
    balance: Joi.number().required().min(0).messages({
      "number.base": "O campo saldo da conta deve ser um número",
      "any.required": "O campo saldo da conta é obrigatório",
      "number.min":
        "O campo saldo da conta deve ser um número maior ou igual a 0",
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
