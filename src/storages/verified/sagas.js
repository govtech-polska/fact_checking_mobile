import { all } from 'redux-saga/effects';

import { apiSaga } from '../../base/api/redux';
import { NEWS, DETAILS } from './actions';

export function* articlesSaga() {
  yield all([apiSaga(NEWS)(), apiSaga(DETAILS)()]);
}
