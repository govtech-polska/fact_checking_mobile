import { call, put, takeEvery, delay } from 'redux-saga/effects';

import { request } from '../../api';
import { REQUEST, SUCCESS, FAILURE } from '../../redux/const';
import { strings } from '../../../constants/strings';

/**
 * Method creates saga for an API request.
 * @param {string} type - The type of the action.
 */
export const apiSaga = type => {
  function* callApi(action) {
    try {
      let data;
      console.log('ApiSaga url: ', action.endpoint);
      const { data: requestData } = yield call(request, action.method, action.endpoint, action.payload);
      console.log('ApiSaga response: ', requestData);
      data = requestData;
      if (!data) {
        data = {
          success: true
        };
      }
      yield put({
        type: type + SUCCESS,
        data
      });
      if (action.afterSagaSuccess) {
        yield call(action.afterSagaSuccess, data);
      }
    } catch (error) {
      yield put({
        type: type + FAILURE,
        error: strings.error_general,
      });
    }
  }

  return function* () {
    yield takeEvery(type + REQUEST, callApi);
  };
};
