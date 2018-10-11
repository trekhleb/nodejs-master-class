/**
 * Module that contains methods to validate request input params.
 */

// Create module container.
const validator = {};

/**
 * Parse string value.
 * @param {*} value
 * @return {string|null}
 */
validator.parseString = (value) => {
  return typeof value === 'string' && value.trim().length ? value.trim() : null;
};

/**
 * Parse boolean value.
 * @param {*} value
 * @return {boolean}
 */
validator.parseBoolean = (value) => {
  return typeof value === 'boolean' && value;
};

/**
 * Parse positive integer number value.
 * @param {*} value
 * @return {number|null}
 */
validator.parsePositiveInteger = (value) => {
  return typeof value === 'number' && value >= 0 ? parseInt(value) : null;
};

/**
 * Parse positive float number value.
 * @param {*} value
 * @return {number|null}
 */
validator.parsePositiveFloat = (value) => {
  return typeof value === 'number' && value > 0 ? parseFloat(value) : null;
};

/**
 * Parse email value.
 * @param {*} value
 * @return {string|null}
 */
validator.parseEmail = (value) => {
  const emailRegExp = /^[a-z0-9\-_.]+[@][a-z0-9\-_.]+[.][a-z]{2,}$/i;
  return typeof value === 'string' && value.trim().length && emailRegExp.test(value) ? value : null;
};

// Export the module.
module.exports = validator;
