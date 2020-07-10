import { REQUEST, SUCCESS, FAILURE, CLEAR } from '../../redux/const';

/**
 * Method creates reducer for an API request.
 * @param {string} type - The type of the action.
 * @param {object} [extension] - Object with [type]: reducer() structure to customize apiReducer.
 */
export const apiReducer = (type, reduceSuccess) => {
  const initialState = {
    data: null,
    error: null,
    isFetching: false
  };

  return (state = initialState, action) => {
    console.log('ApiReducer type: ', action.type)
    console.log('ApiReducer action: ', action)
    console.log('ApiReducer reduceSuccess: ', reduceSuccess)
    switch (action.type) {
      case type + REQUEST:
        return {
          ...(action.clearOnRequest ? initialState : state),
          isFetching: true
        };
      case type + SUCCESS: {
        const nextState = {
          ...state,
          error: initialState.error,
          isFetching: initialState.isFetching
        };
        if (reduceSuccess) {
          return reduceSuccess(nextState, action);
        }
        return {
          ...nextState,
          data: action.data
        };
      }
      case type + FAILURE:
        return {
          ...state,
          error: action.error,
          isFetching: initialState.isFetching
        };
      case type + CLEAR:
        return initialState;
      case type + CLEAR + FAILURE:
        return {
          ...state,
          error: null
        };
      default:
        return state;
    }
  };
};
