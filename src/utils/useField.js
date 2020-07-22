import { useState, useEffect } from 'react';
import validatejs from 'validate.js';

/**
 * Hook for field state management.
 * @param {Object} hookOptions Object which provides options to hook.
 * @param {string} hookOptions.initialValue Initial field value.
 * @param {Object} hookOptions.validator Constraints from http://validatejs.org/ in format { <validatorName>: <validatorOptions> }.
 */
export const useField = ({ initialValue, validator }) => {
  const [value, setValue] = useState(initialValue);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (errors.length > 0) {
      isValid();
    }
  }, [value]);

  const isValid = () => {
    if (validator) {
      const _errors = validatejs.single(value, validator) ?? [];
      setErrors(_errors);
      return _errors.length === 0;
    }
    return true;
  };

  return {
    value,
    setValue,
    errors,
    isValid,
  };
};
