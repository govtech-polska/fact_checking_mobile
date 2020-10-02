import { combineReducers } from 'redux';

import { SET_LANGUAGE } from './actions';

const languageReducer = (state = 'pl', action) => {
  switch (action.type) {
    case SET_LANGUAGE:
      console.log('Reducer SET_LANGUAGE: ', action.payload);
      return action.payload;
    default:
      return state;
  }
};

export const settings = combineReducers({
  language: languageReducer,
});
