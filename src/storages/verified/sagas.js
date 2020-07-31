import { all } from 'redux-saga/effects';

import { apiSaga } from '../../base/api/redux';
import { NEWS, DETAILS, NEWS_CATEGORIES } from './actions';

export function* articlesSaga() {
  yield all([apiSaga(NEWS)(), apiSaga(DETAILS)(), apiSaga(NEWS_CATEGORIES)()]);
}
