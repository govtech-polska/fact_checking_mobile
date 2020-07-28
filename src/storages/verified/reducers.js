import { combineReducers } from 'redux';

import { apiReducer } from '../../base/api/redux';
import { NEWS, DETAILS, NEWS_CATEGORIES } from './actions';

export const articles = combineReducers({
  verified: apiReducer(NEWS, (nextState, action) => {
    if (
      nextState.data &&
      nextState.data.current_page !== action.data.current_page &&
      action.data.current_page !== 1
    ) {
      const newResults = [...nextState.data?.results, ...action.data?.results];
      return {
        ...nextState,
        data: {
          ...action.data,
          results: newResults,
        },
      };
    } else {
      return {
        ...nextState,
        data: action.data,
      };
    }
  }),

  details: apiReducer(DETAILS),
  categories: apiReducer(NEWS_CATEGORIES),
});
