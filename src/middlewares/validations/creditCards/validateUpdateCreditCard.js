const Joi = require("joi");
const { isAfter } = require("date-fns");

exports.validateUpdateCreditCard = (req, res, next) => {
  const schema = Joi.object({
    alias: Joi.string().max(255).messages({
      "string.base": "O campo apelido deve ser um texto",
      "string.max": "O campo apelido deve ter no máximo 255 caracteres",
    }),
    flag: Joi.string()
      .required()
      .valid("VISA", "MASTERCARD", "AMERICAN")
      .messages({
        "string.base": "O campo bandeira deve ser um texto",
        "any.required": "O campo bandeira é obrigatório",
        "any.only": "O campo bandeira deve ser VISA, MASTERCARD ou AMERICAN",
      }),
    number: Joi.string()
      .required()
      .pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)
      .messages({
        "any.required": "O campo número do cartão é obrigatório",
        "string.pattern.base":
          "O campo número do cartão deve ter o formato 1234 5678 9012 3456",
      }),
    dueDate: Joi.number().required().integer().positive().messages({
      "number.base": "O campo dia do vencimento deve ser um número",
      "number.integer": "O campo dia do vencimento deve ser um número inteiro",
      "number.positive":
        "O campo dia do vencimento deve ser um número positivo",
      "any.required": "O campo dia do vencimento é obrigatório",
    }),
    expirationDate: Joi.date()
      .required()
      .min(new Date().toISOString())
      .custom((value, helpers) => {
        if (!isAfter(value, new Date())) {
          return helpers.message(
            "A data da expiração deve ser posterior a data atual"
          );
        }
      })
      .messages({
        "any.required": "O campo data da expiração é obrigatório",
        "date.base": "A data de expiração deve estar no formato válido",
        "date.min": "A data de expiração deve ser posterior à data atual",
      }),
    limit: Joi.number().min(0).messages({
      "number.base": "O campo limite do cartão deve ser um número",
      "number.min":
        "O campo limite do cartão deve ser um número maior ou igual a 0",
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
