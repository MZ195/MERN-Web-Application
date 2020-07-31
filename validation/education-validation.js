const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function ValidateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (!Validator.isEmail(data.school)) {
    errors.school = "school field is required";
  }

  if (!Validator.isEmail(data.degree)) {
    errors.degree = "degree field is required";
  }

  if (!Validator.isEmail(data.fieldofstudy)) {
    errors.fieldofstudy = "field of study field is required";
  }

  if (!Validator.isEmail(data.from)) {
    errors.from = "From date field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
