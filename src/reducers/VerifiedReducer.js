import {
  FETCH_INITIAL_VERIFIED_SUCCESS,
  FETCH_NEXT_PAGE_VERIFIED_SUCCESS,
} from '../actions'

const VERIFIED_INITIAL_STATE = {
  articles: [],
  nextUrl: null,
  shouldLoadNextPage: false,
}

export default (state = VERIFIED_INITIAL_STATE, action) => {
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
}