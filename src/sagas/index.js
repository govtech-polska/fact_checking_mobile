import { all } from 'redux-saga/effects';
import { verifiedSaga } from './VerifiedSaga';

function* rootSaga() {
  yield all([
    verifiedSaga(),
  ]);
}

export default rootSaga;