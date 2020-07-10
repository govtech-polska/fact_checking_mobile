export const getVerifiedList = (state) => state.verified.data?.results || [];
export const getShouldLoadVerifiedNextPage = (state) => {
  const currentPage = state.verified.data?.current_page;
  const pageSize = state.verified.data?.page_size;
  const total = state.verified.data?.total;
  return (currentPage * pageSize) < total;
}
export const getVerifiedNextPage = (state) => state.verified.data?.current_page + 1;

export const getVerifiedDetails = (state, id) => {
  const index = state.articlesDetails.items.findIndex(article => article.id === id);
  return state.articlesDetails.items[index];
}

export const getIsFetchingInitial = (state) => state.verified.isFetching && state.verified.data?.results === undefined;
export const getIsFetchingNextPage = (state) => (state.verified.data?.results !== undefined) && state.verified.isFetching;
