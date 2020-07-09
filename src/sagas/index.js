import { all } from 'redux-saga/effects';
import { verifiedSaga } from './VerifiedSaga';
import { articlesSaga } from '../storages/verified/sagas';

function* rootSaga() {
  yield all([
    verifiedSaga(),
    articlesSaga(),
  ]);
}

export default rootSaga;