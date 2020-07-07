import { all, call, put, cancelled, select, takeLatest, delay, race, take } from 'redux-saga/effects';
import { takeOrCancel } from './common';
import { strings } from '../constants/strings';

import {
  FETCH_VERIFIED_REQUEST,
  FETCH_INITIAL_VERIFIED_SUCCESS,
  VERIFIED_SCREEN_UNMOUNTED,
  FETCH_NEXT_PAGE_VERIFIED_REQUEST,
  FETCH_NEXT_PAGE_VERIFIED_SUCCESS,
  FETCH_VERIFIED_DETAILS_REQUEST,
  FETCH_VERIFIED_DETAILS_SUCCESS,
  VERIFIED_DETAILS_SCREEN_UNMOUNTED,
} from '../actions';
import Api from './Api';
import {
  getVerifiedNextPageUrl,
  getVerifiedDetails,
} from '../selectors/VerifiedSelectors';

function* fetchVerified(action) {
  const { meta: { resolve, reject } } = action;
  try {
    const { status, data } = yield call(Api.get, `https://portal-api.app.fakehunter.pap.pl/news?page=1`);
    if (status < 200 || status > 299) {
      throw new Error(strings.error_general)
    }
    yield put({
      type: FETCH_INITIAL_VERIFIED_SUCCESS,
      payload: {
        results: data?.results,
        nextUrl: data?.next,
      }
    })
    resolve(true);
  } catch (error) {
    reject(error);
  } finally {
    if (yield cancelled()) {
      resolve(false);
    }
  }
}

function* fetchNextPageVerified(action) {
  const { meta: { resolve, reject } } = action;
  try {
    const nextUrl = yield select((state) => getVerifiedNextPageUrl(state.verified));
    const { status, data } = yield call(Api.get, nextUrl);
    if (status < 200 || status > 299) {
      throw new Error(strings.error_general)
    }
    yield put({
      type: FETCH_NEXT_PAGE_VERIFIED_SUCCESS,
      payload: {
        results: data?.results,
        nextUrl: data?.next,
      }
    })
    resolve(true);
  } catch (error) {
    reject(error);
  } finally {
    if (yield cancelled()) {
      resolve(false);
    }
  }
}

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
    takeOrCancel(FETCH_VERIFIED_REQUEST, fetchVerified, VERIFIED_SCREEN_UNMOUNTED),
    takeOrCancel(FETCH_NEXT_PAGE_VERIFIED_REQUEST, fetchNextPageVerified, VERIFIED_SCREEN_UNMOUNTED),
    takeOrCancel(FETCH_VERIFIED_DETAILS_REQUEST, fetchVerifiedDetails, VERIFIED_DETAILS_SCREEN_UNMOUNTED)
  ])
}
