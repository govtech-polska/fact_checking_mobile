import { all } from 'redux-saga/effects';

import { apiSaga } from '../../base/api/redux';
import { REPORT_SUBMIT } from './actions';

export function* reportSaga() {
  yield all([apiSaga(REPORT_SUBMIT)()]);
}
