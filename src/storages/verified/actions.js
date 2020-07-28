import { apiAction } from '../../base/api/redux';
import { apiUrls } from '../../constants/urls';
import { resolveUrl } from '../../utils/url';

export const NEWS = 'feed.NEWS_LIST';
export const NEWS_CATEGORIES = 'feed.NEWS_CATEGORIES';
export const DETAILS = 'feed.NEWS_DETAILS';

export const feedActions = {
  categories: () =>
    apiAction(NEWS_CATEGORIES, resolveUrl(apiUrls.NEWS_CATEGORIES)),
  list: (page) =>
    apiAction(NEWS, resolveUrl(apiUrls.NEWS, { page: page || 1 }), {
      clearOnRequest: page === 1 ? true : false,
    }),
  details: (id) => apiAction(DETAILS, resolveUrl(apiUrls.NEWS_DETAILS, { id })),
};
