export const promiseDispatch = (dispatch, actionCreator, ...payload) => {
  return new Promise((resolve, reject) => {
    return dispatch(actionCreator(...payload, resolve, reject));
  });
};
