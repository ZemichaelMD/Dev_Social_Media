const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  const errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (validator.isEmpty(data.school)) {
    errors.school = 'School field is required.';
  }
  if (validator.isEmpty(data.degree)) {
    errors.degree = 'degree field is required.';
  }
  if (validator.isEmpty(data.from)) {
    errors.from = 'From Date field is required.';
  }
  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'fieldofstudy field is required.';
  }
  // if (!validator.isDate(data.from)) {
  //   errors.from = 'Invalid Date Format.';
  // }
  // if (!isEmpty(data.to)) {
  //   if (!validator.isDate(data.to)) {
  //     errors.to = 'Invalid Date Format.';
  //   }
  // }

  return { errors, isValid: isEmpty(errors) };
};
