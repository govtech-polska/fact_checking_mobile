import { all } from 'redux-saga/effects';
import { articlesSaga } from '../../storages/verified/sagas';
import { reportSaga } from '../../storages/report/sagas';

function* rootSaga() {
  yield all([articlesSaga(), reportSaga()]);
}

export default rootSaga;
