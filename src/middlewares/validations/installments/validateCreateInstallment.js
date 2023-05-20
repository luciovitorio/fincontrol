const Joi = require("joi");
const { isAfter } = require("date-fns");

const currentDate = new Date();
const currentDateString = currentDate.toISOString().split("T")[0];

exports.validateCreateInstallment = (req, res, next) => {
  const schema = Joi.object({
    cardId: Joi.string().required().uuid().messages({
      "string.base": "O campo associar cartão deve ser um texto",
      "string.uuid": "O campo associar cartão deve ser um UUID válido",
      "any.required": "O campo associar cartão é obrigatório",
    }),
    description: Joi.string().max(255).min(3).messages({
      "string.min": "O campo descrição deve ter no mínimo 3 caracteres",
      "string.max": "O campo descrição deve ter no máximo 255 caracteres",
    }),
    totalAmount: Joi.number().min(0).required().messages({
      "any.required": "O campo valor total é obrigatório",
      "number.base": "O campo valor total deve ser um número",
      "number.min": "O campo valor total deve ser um número maior ou igual a 0",
    }),
    numInstallments: Joi.number()
      .min(2)
      .integer()
      .positive()
      .required()
      .messages({
        "any.required": "O campo número de parcelas é obrigatório",
        "number.base": "O campo número de parcelas deve ser um número",
        "number.integer":
          "O campo número de parcelas deve ser um número inteiro",
        "number.positive":
          "O campo número de parcelas deve ser um número positivo",
        "number.min":
          "O campo número de parcelas deve ser um número maior ou igual a 2",
      }),
    dateOfPurchase: Joi.date().required().iso().messages({
      "date.base": "A data da compra deve estar no formato válido",
      "any.required": "O campo data da compra é obrigatório",
    }),
    dueDate: Joi.date()
      .required()
      .min(new Date().toISOString())
      .custom((value, helpers) => {
        if (!isAfter(value, new Date())) {
          return helpers.message(
            "A data de vencimento deve ser posterior a data atual"
          );
        }
      })
      .messages({
        "date.base": "A data de vencimento deve estar no formato válido",
        "date.min": "A data de vencimento deve ser posterior à data atual",
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
