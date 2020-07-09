import { all } from 'redux-saga/effects';
import { articlesSaga } from  '../../storages/verified/sagas';

function* rootSaga() {
  yield all([
    articlesSaga(),
  ]);
}

export default rootSaga;