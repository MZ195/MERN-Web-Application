const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(date) {
  let errors = {};

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be at least 2 characters but not more than 30.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
