
import { apiAction } from '../../base/api/redux';
import { apiUrls } from '../../constants/api';
import { resolveUrl } from '../../utils/url';

export const NEWS = 'feed.NEWS_LIST';
export const DETAILS = 'feed.NEWS_DETAILS';

export const feedActions = {
  list: url => apiAction(NEWS, url || resolveUrl(apiUrls.NEWS, { page: 1 }), { clearOnRequest: url ? false : true }),
  details: id => apiAction(DETAILS, resolveUrl(apiUrls.NEWS_DETAILS, { id })),
}