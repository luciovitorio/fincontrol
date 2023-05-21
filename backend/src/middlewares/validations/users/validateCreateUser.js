const Joi = require("joi");

exports.validateCreateUser = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required().max(255).messages({
      "any.required": "O campo nome de usuario é obrigatório",
      "string.max": "O campo nome de usuario deve ter no máximo 255 caracteres",
    }),
    password: Joi.string().required().min(3).messages({
      "any.required": "O campo senha é obrigatório",
      "string.min": "O campo senha deve ter no mínimo 3 caracteres",
    }),
    password_confirmation: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.required": "O campo confirmação de senha é obrigatório",
        "string.min":
          "O campo confirmação de senha deve ter no mínimo 3 caracteres",
        "any.only": "As senhas não conferem",
      }),
    email: Joi.string().email().messages({
      "string.email": "O campo email deve ser um email válido",
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
