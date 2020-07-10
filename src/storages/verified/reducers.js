import { combineReducers } from 'redux';

import { apiReducer } from '../../base/api/redux';
import {
  NEWS,
  DETAILS,
} from './actions'

export const articles = combineReducers({
  verified: apiReducer(NEWS, ((nextState, action) => {
    if (nextState.data) {
      console.log('verifiedApiReducer nextState: ', nextState)
      const newResults = [...nextState.data?.results, ...action.data?.results]
      return {
        ...nextState,
        data: {
          ...nextState.data,
          results: newResults,
        }
      }
    } else {
      return {
        ...nextState,
        data: action.data
      }
    }
  })),

  details: apiReducer(DETAILS),
})