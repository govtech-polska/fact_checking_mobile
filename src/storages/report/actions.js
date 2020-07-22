import { apiAction } from '../../base/api/redux';
import { apiUrls, COLLECTOR_URL } from '../../constants/urls';

export const REPORT_SUBMIT = 'report.REPORT_SUBMIT';

export const reportActions = {
  submitReport: (payload) =>
    apiAction(REPORT_SUBMIT, apiUrls.REPORT_SUBMIT, {
      method: 'POST',
      payload,
      requestOptions: {
        baseUrl: COLLECTOR_URL,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    }),
};
