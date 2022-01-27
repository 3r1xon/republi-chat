// Joi validations schema
const Joi            = require('joi');


module.exports = {
  userSchema: Joi.object({
    name: Joi.string()
      .min(3)
      .max(30)
      .pattern(new RegExp(/^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/)),

    email: Joi.string()
      .email(),

    password: Joi.string()
      .min(8)
      .max(255),

  }),

  msgSchema: Joi.object({
    message: Joi.string()
      .required()
      .max(2000)
      .pattern(new RegExp(/^[^\s]+(\s+[^\s]+)*$/))
  })
}