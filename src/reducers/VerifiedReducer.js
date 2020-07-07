import { combineReducers } from 'redux';
import {
  FETCH_INITIAL_VERIFIED_SUCCESS,
  FETCH_NEXT_PAGE_VERIFIED_SUCCESS,
  FETCH_VERIFIED_DETAILS_SUCCESS,
} from '../actions'

const verifiedList = (
  state = {
    articles: [],
    nextUrl: null,
    shouldLoadNextPage: false,
  },
  action,
) => {
  switch (action.type) {
    case FETCH_INITIAL_VERIFIED_SUCCESS:
      return {
        ...state,
        articles: action.payload.results,
        nextUrl: action.payload.nextUrl,
        shouldLoadNextPage: action.payload.nextUrl !== null,
      }
    case FETCH_NEXT_PAGE_VERIFIED_SUCCESS:
      return {
        ...state,
        articles: [...state.articles, ...action.payload.results],
        nextUrl: action.payload.nextUrl,
        shouldLoadNextPage: action.payload.nextUrl !== null,
      }
    default: return state
  }
};

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
  verifiedList,
  articlesDetails,
});
