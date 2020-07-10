import axios from 'axios';

import { BASE_URL } from '../../constants/api'

/**
 * Creates an API request.
 * @param {string} method - The type of the HTTP request method.
 * @param {string} url - The endpoint URL.
 * @param {Object} data - The payload data.
 */
export const request = (method, url, data) => {
  const requestConfig = {
    method,
    url: BASE_URL + url,
    data,
  };

  return axios(requestConfig);
};
