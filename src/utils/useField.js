import { useState, useEffect } from 'react';
import validatejs from 'validate.js';

export const useField = ({ initialValue, validator }) => {
  const [value, setValue] = useState(initialValue);
  const [errors, setErrors] = useState([]);
  const isValid = errors.length === 0;

  useEffect(() => {
    if (errors.length > 0) {
      validate();
    }
  }, [value]);

  const validate = () => {
    setErrors(validatejs.single(value, validator) ?? []);
  };

  return {
    value,
    setValue,
    errors,
    isValid,
    validate,
  };
};
