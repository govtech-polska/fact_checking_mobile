import { all } from 'redux-saga/effects';
// import { authFlow } from './AuthSaga';
// import { onboardingSaga } from './OnboardingSaga';
// import { settingsSaga } from './SettingsSaga';
// import { exploreSaga } from './ExploreSaga';
// import { notesSaga } from './NotesSaga';
// import { landingSaga } from './LandingSaga';

function* rootSaga() {
  yield all([
    // authFlow(),
    // landingSaga(),
    // exploreSaga(),
    // onboardingSaga(),
    // notesSaga(),
    // settingsSaga(),
  ]);
}

export default rootSaga;