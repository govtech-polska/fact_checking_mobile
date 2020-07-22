import axios from 'axios';

import { BASE_URL } from '../../constants/urls';

/**
 * Creates an API request.
 * @param {string} method - The type of the HTTP request method.
 * @param {string} url - The endpoint URL.
 * @param {Object} data - The payload data.
 * @param {Object} options - Request additional options
 * @param {string} options.baseUrl - Base url override
 */
export const request = (method, url, data, options = { baseUrl: BASE_URL }) => {
  const requestConfig = {
    baseURL: options.baseUrl,
    method,
    url,
    data,
    headers: options.headers,
  };

  console.log(requestConfig);

  return axios(requestConfig);
};
