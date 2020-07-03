export const getVerifiedList = (state) => state.verifiedList.articles || [];
export const getShouldLoadVerifiedNextPage = (state) => state.verifiedList.shouldLoadNextPage || false;
export const getVerifiedNextPageUrl = (state) => state.verifiedList.nextUrl || null;
