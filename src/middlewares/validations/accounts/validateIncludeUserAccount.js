const Joi = require("joi");

exports.validateIncludeUserAccount = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required().uuid().messages({
      "string.base": "O campo associar usuario deve ser um texto",
      "string.uuid": "O campo deve ser um UUID válido",
      "any.required": "O campo associar usuario é obrigatório",
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
