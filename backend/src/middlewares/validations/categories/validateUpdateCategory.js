const Joi = require("joi");

exports.validateUpdateCategory = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().max(255).messages({
      "any.required": "O campo nome da categoria é obrigatório",
      "string.max": "O campo nome de usuario deve ter no máximo 255 caracteres",
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
