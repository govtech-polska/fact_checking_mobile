import { apiAction } from '../../base/api/redux';
import { apiUrls } from '../../constants/api';
import { resolveUrl } from '../../utils/url';

export const NEWS = 'feed.NEWS_LIST';
export const DETAILS = 'feed.NEWS_DETAILS';

export const feedActions = {
  list: (page) =>
    apiAction(NEWS, resolveUrl(apiUrls.NEWS, { page: page || 1 }), {
      clearOnRequest: page === 1 ? true : false
    }),
  details: (id) => apiAction(DETAILS, resolveUrl(apiUrls.NEWS_DETAILS, { id }))
};
