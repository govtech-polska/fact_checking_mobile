import validatejs from 'validate.js';

/**
 * Wrapper on validate func from validate.js.
 * @param {Object} constrains Object with validation constraints more info: https://validatejs.org/#validators
 * @returns {function(string):(string|undefined)} Function which gets input value and returns error or undefined
 */
export const validate = (constrains) => (value) =>
  (validatejs.single(value, constrains) ?? [])[0];
