import { combineReducers } from 'redux';
import { articles } from '../../storages/verified/reducers';
import { report } from '../../storages/report/reducers';

export default combineReducers({
  articles,
  report,
});
