import axios from 'axios';

/**
 * Creates an API request.
 * @param {string} method - The type of the HTTP request method.
 * @param {string} url - The endpoint URL.
 * @param {Object} data - The payload data.
 */
export const request = (method, url, data) => {
  let requestConfig = {
    method,
    url,
    data,
  };

  return axios(requestConfig);
};
