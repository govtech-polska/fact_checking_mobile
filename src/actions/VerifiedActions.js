export const FETCH_VERIFIED_DETAILS_REQUEST = 'FETCH_VERIFIED_DETAILS_REQUEST';
export const FETCH_VERIFIED_DETAILS_SUCCESS = 'FETCH_VERIFIED_DETAILS_SUCCESS';
export const VERIFIED_DETAILS_SCREEN_UNMOUNTED = 'VERIFIED_DETAILS_SCREEN_UNMOUNTED';

export const fetchVerifiedDetailsRequest = (
  id,
  resolve,
  reject,
) => {
  return {
    type: FETCH_VERIFIED_DETAILS_REQUEST,
    payload: {
      id,
    },
    meta: {
      resolve,
      reject,
    },
  };
};

export const verifiedDetailsScreenUnmounted = (
  resolve,
  reject,
) => {
  return {
    type: VERIFIED_DETAILS_SCREEN_UNMOUNTED,
    meta: {
      resolve,
      reject,
    },
  }
}
