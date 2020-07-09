import { combineReducers } from 'redux';
import {
  FETCH_NEXT_PAGE_VERIFIED_SUCCESS,
  FETCH_VERIFIED_DETAILS_SUCCESS,
} from '../actions'

const articlesDetails = (
  state = {
    items: [],
  },
  action,
) => {
  switch (action.type) {
    case FETCH_VERIFIED_DETAILS_SUCCESS:
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: action.payload.id,
            data: action.payload.item
          },
        ],
      }
    default: return state;
  }
}

export default combineReducers({
  articlesDetails,
});
