import { all, call, put, cancelled, select, takeLatest, delay, race, take } from 'redux-saga/effects';
import { takeOrCancel } from './common';
import { strings } from '../constants/strings';

import {
  FETCH_VERIFIED_REQUEST,
  FETCH_INITIAL_VERIFIED_SUCCESS,
  VERIFIED_SCREEN_UNMOUNTED,
  FETCH_NEXT_PAGE_VERIFIED_REQUEST,
  FETCH_NEXT_PAGE_VERIFIED_SUCCESS,
} from '../actions';
import Api from './Api';
import {
  getVerifiedNextPageUrl
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
    const nextUrl = yield select(getVerifiedNextPageUrl(state.verified));
    // const nextUrl = yield select((state) => state.verified.nextUrl);
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

export function* verifiedSaga() {
  yield all([
    takeOrCancel(FETCH_VERIFIED_REQUEST, fetchVerified, VERIFIED_SCREEN_UNMOUNTED),
    takeOrCancel(FETCH_NEXT_PAGE_VERIFIED_REQUEST, fetchNextPageVerified, VERIFIED_SCREEN_UNMOUNTED),
  ])
}
