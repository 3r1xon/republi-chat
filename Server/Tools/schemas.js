// Joi validations schema
const Joi            = require('joi');



const userSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(3)
    .max(30)
    .pattern(new RegExp(/^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/)),

  email: Joi.string()
    .email(),

  password: Joi.string()
    .required()
    .min(8)
    .max(255),

});



module.exports = userSchema;



const msgSchema = Joi.object({
  message: Joi.string()
    .max(2000)
    .required()
    .pattern(new RegExp(/^\S*$/))
});



module.exports = msgSchema;