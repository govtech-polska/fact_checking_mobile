import { all, call, put, cancelled, select, takeLatest, delay, race, take } from 'redux-saga/effects';
import { takeOrCancel } from './common';
import { strings } from '../constants/strings';

import {
  FETCH_VERIFIED_DETAILS_REQUEST,
  FETCH_VERIFIED_DETAILS_SUCCESS,
  VERIFIED_DETAILS_SCREEN_UNMOUNTED,
} from '../actions';
import Api from './Api';
import {
  getVerifiedDetails,
} from '../selectors/VerifiedSelectors';

function* fetchVerifiedDetails(action) {
  const { meta: { resolve, reject }, payload: { id: articleId } } = action;
  const article = yield select((state) => getVerifiedDetails(state.verified, articleId));
  if (article) {
    resolve(article.data);
    return;
  }
  try {
    const { status, data } = yield call(Api.get, `https://portal-api.app.fakehunter.pap.pl/news/${articleId}`);
    if (status < 200 || status > 299) {
      throw new Error(strings.error_general)
    }
    yield put({
      type: FETCH_VERIFIED_DETAILS_SUCCESS,
      payload: {
        id: articleId,
        item: data,
      }
    })
    resolve(data);
  } catch (error) {
    reject(error);
  } finally {
    if (yield cancelled()) {
      resolve(null);
    }
  }
}

export function* verifiedSaga() {
  yield all([
    takeOrCancel(FETCH_VERIFIED_DETAILS_REQUEST, fetchVerifiedDetails, VERIFIED_DETAILS_SCREEN_UNMOUNTED)
  ])
}
