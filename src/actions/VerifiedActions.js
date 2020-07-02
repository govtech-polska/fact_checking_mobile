export const FETCH_VERIFIED_REQUEST = 'FETCH_VERIFIED_REQUEST';
export const FETCH_INITIAL_VERIFIED_SUCCESS = 'FETCH_INITIAL_VERIFIED_SUCCESS';
export const VERIFIED_SCREEN_UNMOUNTED = 'VERIFIED_SCREEN_UNMOUNTED';

export const FETCH_NEXT_PAGE_VERIFIED_REQUEST = 'FETCH_NEXT_VERIFIED_REQUEST';
export const FETCH_NEXT_PAGE_VERIFIED_SUCCESS = 'FETCH_NEXT_VERIFIED_SUCCESS';

export const fetchVerifiedRequest = (
  resolve,
  reject,
) => {
  return {
    type: FETCH_VERIFIED_REQUEST,
    meta: {
      resolve,
      reject,
    },
  };
};

export const fetchNextPageVerifiedRequest = (
  resolve,
  reject,
) => {
  return {
    type: FETCH_NEXT_PAGE_VERIFIED_REQUEST,
    meta: {
      resolve,
      reject,
    },
  };
};
