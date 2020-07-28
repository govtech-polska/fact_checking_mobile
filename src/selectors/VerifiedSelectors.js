import { strings } from '../constants/strings';

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

export const getIsFetchingInitial = (state) =>
  state.verified.isFetching && state.verified.data?.results === undefined;
export const getIsFetchingNextPage = (state) =>
  state.verified.data?.results !== undefined && state.verified.isFetching;

export const getCategories = (state) => {
  const allCategory = {
    created_at: Date(),
    id: 0,
    name: strings.verifiedDetails.categoriesAll,
  };
  const moreCategory = {
    created_at: Date(),
    id: 1,
    name: strings.verifiedDetails.categoriesMore,
  };
  let categories = [];
  if (state.categories.data?.results) {
    categories = [allCategory, ...state.categories.data?.results.slice(0, 5)];
    if (state.categories.data?.results.length > 5) {
      categories = [...categories, moreCategory];
    }
    return categories;
  }
  return [];
};
