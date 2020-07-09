import { combineReducers } from 'redux';
import VerifiedReducer from './VerifiedReducer';
import { articles } from '../storages/verified/reducers';

export default combineReducers({
  verified: VerifiedReducer,
  articles,
});
