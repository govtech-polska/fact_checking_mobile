import { combineReducers } from 'redux';

import { apiReducer } from '../../base/api/redux';
import { REPORT_SUBMIT } from './actions';

export const report = combineReducers({
  submission: apiReducer(REPORT_SUBMIT),
});
