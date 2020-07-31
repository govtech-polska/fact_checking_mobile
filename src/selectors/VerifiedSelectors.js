export const getVerifiedList = (state) => state.verified.data?.results || [];
export const getShouldLoadVerifiedNextPage = (state) => {
  const currentPage = state.verified.data?.current_page;
  const pageSize = state.verified.data?.page_size;
  const total = state.verified.data?.total;
  return currentPage * pageSize < total;
};
export const getVerifiedNextPage = (state) =>
  state.verified.data?.current_page + 1;

export const getVerifiedDetails = (state, id) => {
  const index = state.articlesDetails.items.findIndex(
    (article) => article.id === id
  );
  return state.articlesDetails.items[index];
};

export const getIsFetching = (state) => state.verified.isFetching;

export const getIsFetchingInitial = (state) =>
  state.verified.isFetching &&
  state.verified.data?.current_page === undefined &&
  state.verified.data?.results === undefined;

export const getIsFetchingNextPage = (state) =>
  state.verified.data?.results !== undefined && state.verified.isFetching;

export const getCategories = (state) => {
  let categories = [];
  if (state.categories.data?.results) {
    categories = state.categories.data?.results.slice(0, 5);
    const selectedCategory = state.selectedCategory.data;
    if (
      selectedCategory &&
      categories.findIndex(
        (category) => category.id === selectedCategory?.id
      ) === -1
    ) {
      categories = [...categories.slice(0, 4), selectedCategory];
    }
    return categories;
  }
  return [];
};

export const getAllCategories = (state) => {
  return state.categories.data?.results || [];
};
