// Ajv validations schema

const user = {
    type: "object",
    properties: {
      email: { type: "string", maxLength: 30, minLength: 3 },
      name: { type: "string", maxLength: 30, minLength: 3 },
      password: { type: "string", maxLength: 255, minLength: 8 },
    },
    required: ["email", "name", "password"],
    additionalProperties: false
};



module.exports = user;