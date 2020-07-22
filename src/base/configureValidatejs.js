import validatejs from 'validate.js';
import { strings } from '../constants/strings';

validatejs.validators.presence.message = strings.validation.presence;
validatejs.validators.email.message = strings.validation.email;
validatejs.validators.url.message = strings.validation.url;

validatejs.validators.optional = (value, options) => {
  return !['', null, undefined].includes(value)
    ? validatejs.single(value, options)
    : null;
};
