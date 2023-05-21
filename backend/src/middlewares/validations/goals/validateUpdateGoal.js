const Joi = require("joi");
const { isAfter } = require("date-fns");

const currentDate = new Date();
const currentDateString = currentDate.toISOString().split("T")[0];

exports.validateUpdateGoal = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().max(255).messages({
      "string.base": "O campo título deve ser um texto",
      "string.max": "O campo título deve ter no máximo 255 caracteres",
      "any.required": "O campo título é obrigatório",
    }),
    description: Joi.string().max(255).min(3).messages({
      "string.min": "O campo descrição deve ter no mínimo 3 caracteres",
      "string.max": "O campo descrição deve ter no máximo 255 caracteres",
    }),
    amount: Joi.number().min(0).required().messages({
      "any.required": "O campo valor total é obrigatório",
      "number.base": "O campo valor total deve ser um número",
      "number.min": "O campo valor total deve ser um número maior ou igual a 0",
    }),
    currentAmount: Joi.number().min(0).required().messages({
      "any.required": "O campo valor atual é obrigatório",
      "number.base": "O campo valor atual deve ser um número",
      "number.min": "O campo valor atual deve ser um número maior ou igual a 0",
    }),
    startDate: Joi.date().required().iso().messages({
      "date.base": "A data inicial deve estar no formato válido",
      "any.required": "O campo inicial é obrigatório",
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
