const Joi = require("joi");
const { isAfter } = require("date-fns");

const currentDate = new Date();
const currentDateString = currentDate.toISOString().split("T")[0];

exports.validateCreateRecurringBill = (req, res, next) => {
  const schema = Joi.object({
    accountId: Joi.string().required().uuid().messages({
      "string.base": "O campo associar conta deve ser um texto",
      "string.uuid": "O campo associar conta deve ser um UUID válido",
      "any.required": "O campo associar conta é obrigatório",
    }),
    description: Joi.string().max(255).min(3).messages({
      "string.min": "O campo descrição deve ter no mínimo 3 caracteres",
      "string.max": "O campo descrição deve ter no máximo 255 caracteres",
    }),
    amount: Joi.number().min(0).required().messages({
      "any.required": "O campo valor é obrigatório",
      "number.base": "O campo limite do cartão deve ser um número",
      "number.min": "O campo valor deve ser um número maior ou igual a 0",
    }),
    initialDate: Joi.date()
      .required()
      .custom((value, helpers) => {
        if (
          isAfter(value, currentDate) ||
          value.toISOString().split("T")[0] === currentDateString
        ) {
          return value;
        } else {
          return helpers.message(
            "A data inicial deve ser posterior a data atual"
          );
        }
      })
      .messages({
        "date.base": "A data inicial deve estar no formato válido",
        "date.min": "A data inicial deve ser posterior à data atual",
      }),
    finishedDate: Joi.date()
      .required()
      .min(new Date().toISOString())
      .custom((value, helpers) => {
        if (!isAfter(value, new Date())) {
          return helpers.message(
            "A data final deve ser posterior a data atual"
          );
        }
      })
      .messages({
        "date.base": "A data final deve estar no formato válido",
        "date.min": "A data final deve ser posterior à data atual",
      }),
    period: Joi.string()
      .required()
      .valid("DAILY", "WEEKLY", "MONTHLY")
      .messages({
        "string.base": "O campo período deve ser um texto",
        "any.required": "O campo período é obrigatório",
        "any.only": "O campo período deve ser DIÁRIO, SEMANAL ou MENSAL",
      }),
    entryType: Joi.string().required().valid("CREDIT", "DEBIT").messages({
      "string.base": "O campo tipo deve ser um texto",
      "any.required": "O campo tipo é obrigatório",
      "any.only": "O campo tipo deve ser CRÉDITO ou DEBITO",
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
