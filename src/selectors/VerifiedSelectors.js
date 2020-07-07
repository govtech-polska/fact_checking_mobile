export const getVerifiedList = (state) => state.verifiedList.articles || [];
export const getShouldLoadVerifiedNextPage = (state) => state.verifiedList.shouldLoadNextPage || false;
export const getVerifiedNextPageUrl = (state) => state.verifiedList.nextUrl || null;

export const getVerifiedDetails = (state, id) => { 
  const index = state.articlesDetails.items.findIndex(article => article.id === id);
  return state.articlesDetails.items[index];
}