import { all, } from 'redux-saga/effects';

import { apiSaga } from '../../base/api/redux';
import {
  VERIFIED,
} from './actions'

export function* articlesSaga() {
  yield all([
    apiSaga(VERIFIED)(),
  ]);
}
