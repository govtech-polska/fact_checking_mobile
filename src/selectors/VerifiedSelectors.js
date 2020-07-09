export const getVerifiedList = (state) => state.verified.data?.results || [];
export const getShouldLoadVerifiedNextPage = (state) => !!state.verified.data?.next;
export const getVerifiedNextPageUrl = (state) => state.verified.data?.next || null;

export const getVerifiedDetails = (state, id) => { 
  const index = state.articlesDetails.items.findIndex(article => article.id === id);
  return state.articlesDetails.items[index];
}

export const getIsFetchingInitial= (state) => !state.verified.data?.next && state.verified.isFetching;
export const getIsFetchingNextPage = (state) => !!state.verified.data?.next && state.verified.isFetching;
