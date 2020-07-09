
import { apiAction } from '../../base/api/redux';
import { apiUrls } from '../../constants/api';
import { resolveUrl } from '../../utils/url';

export const VERIFIED = 'VERIFIED_TEST';

export const verifiedActions = {
  verified: url => apiAction(VERIFIED, url || resolveUrl(apiUrls.NEWS, { page: 1 }), {
    clearOnRequest: url ? false : true,
  })
}