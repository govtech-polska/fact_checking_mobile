import { call, select } from 'redux-saga/effects';
import axios from 'axios';

function* get(url) {
  const result = yield call(axios.get, url);
  return result;
}

function* post(url, data = {}) {
  const result = yield call(axios.post, url, data);
  return result;
}

function* put(url, data = {}) {
  const result = yield call(axios.put, url, data);
  return result;
}

export default {
  get,
  post,
  put,
};
