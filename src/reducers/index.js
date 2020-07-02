import { combineReducers } from 'redux';
import VerifiedReducer from './VerifiedReducer';

export default combineReducers({
  verified: VerifiedReducer,
});
