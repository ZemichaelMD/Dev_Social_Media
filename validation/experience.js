const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  const errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (validator.isEmpty(data.title)) {
    errors.title = 'Title field is required.';
  }
  if (validator.isEmpty(data.company)) {
    errors.Company = 'Company field is required.';
  }
  if (validator.isEmpty(data.from)) {
    errors.from = 'Date field is required.';
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
